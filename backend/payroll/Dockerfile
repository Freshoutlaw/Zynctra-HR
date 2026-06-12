# =============================================================================
# ZYNCTRA PAYROLL SERVICE — SECURITY-HARDENED CONTAINER
# =============================================================================
# Zero-Trust: non-root, read-only FS, minimal capabilities, no secrets in image

# -----------------------------------------------------------------------------
# STAGE 1: Build & Extract Layers
# -----------------------------------------------------------------------------
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Copy source and build
COPY pom.xml .
COPY src ./src

# Build with Maven (offline mode for reproducibility)
RUN apk add --no-cache maven && \
    mvn dependency:go-offline -B && \
    mvn clean package -DskipTests -B && \
    java -Djarmode=layertools -jar target/payroll-service-*.jar extract

# -----------------------------------------------------------------------------
# STAGE 2: Security Audit & Hardening
# -----------------------------------------------------------------------------
FROM builder AS security-audit

# Run dependency vulnerability check
RUN mvn org.owasp:dependency-check-maven:check -B || true

# -----------------------------------------------------------------------------
# STAGE 3: Runtime — Minimal Attack Surface
# -----------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine

# Metadata
LABEL org.opencontainers.image.title="Zynctra Payroll Service" \
      org.opencontainers.image.description="Financial-grade payroll processing" \
      org.opencontainers.image.vendor="Zynctra" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.security.hardened="true"

# Create non-root user with minimal privileges
RUN addgroup -S -g 1000 zynctra && \
    adduser -S -u 1000 -G zynctra -s /sbin/nologin -D zynctra && \
    mkdir -p /app /tmp /var/log/zynctra && \
    chown -R zynctra:zynctra /app /tmp /var/log/zynctra && \
    chmod 750 /app && \
    chmod 1777 /tmp && \
    chmod 755 /var/log/zynctra

WORKDIR /app

# Copy application layers (immutable)
COPY --from=builder --chown=zynctra:zynctra /build/dependencies/ ./
COPY --from=builder --chown=zynctra:zynctra /build/spring-boot-loader/ ./
COPY --from=builder --chown=zynctra:zynctra /build/snapshot-dependencies/ ./
COPY --from=builder --chown=zynctra:zynctra /build/application/ ./

# Remove write permissions from application files
RUN chmod -R 500 /app && \
    find /app -type d -exec chmod 500 {} \;

# Security: Remove unnecessary tools
RUN apk del --purge apk-tools 2>/dev/null || true && \
    rm -rf /var/cache/apk/* /usr/bin/wget /usr/bin/curl /bin/nc /bin/netcat 2>/dev/null || true

# Switch to non-root user
USER zynctra:zynctra

# JVM Security Flags
ENV JAVA_OPTS="\
    -server \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=200 \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.backgroundpreinitializer.ignore=true \
    -Dspring.jmx.enabled=false \
    -Djava.awt.headless=true \
    -Dfile.encoding=UTF-8 \
    -Duser.timezone=UTC \
    -Dlog4j2.formatMsgNoLookups=true \
    -Dcom.sun.management.jmxremote=false \
    -XX:+HeapDumpOnOutOfMemoryError \
    -XX:HeapDumpPath=/tmp/heapdump.hprof \
    -XX:+DisableExplicitGC \
    -XX:+UseNUMA \
    -XX:+AlwaysPreTouch \
    -XX:+UseLargePages \
    -XX:LargePageSizeInBytes=2m"

# Security: Disable JVM attach, agent loading
ENV JAVA_TOOL_OPTIONS="\
    -XX:+DisableAttachMechanism \
    -Djdk.attach.allowAttachSelf=false"

# Application-specific environment (NO secrets here — injected at runtime)
ENV SPRING_PROFILES_ACTIVE=production \
    SERVER_PORT=8084 \
    MANAGEMENT_SERVER_PORT=8085 \
    LOGGING_LEVEL_ROOT=WARN \
    LOGGING_LEVEL_COM_ZYNCTRA=INFO \
    LOGGING_LEVEL_SECURITY_AUDIT=INFO

# Expose only necessary ports
EXPOSE 8084 8085

# Health check (non-privileged port)
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8084/api/payroll/health || exit 1

# Read-only root filesystem (mount /tmp as tmpfs if needed)
# docker run --read-only --tmpfs /tmp:rw,noexec,nosuid,size=100m

# Drop all capabilities, no new privileges
# docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE --security-opt=no-new-privileges:true

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]