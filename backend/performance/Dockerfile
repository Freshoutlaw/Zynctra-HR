# backend/performance/Dockerfile
# Multi-stage build for minimal attack surface

# Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build

# Install dependencies for build only
RUN apk add --no-cache bash

# Copy source and build
COPY . .
RUN ./mvnw clean package -DskipTests -Dspring.profiles.active=prod     -Dspring.devtools.restart.enabled=false

# Runtime stage — minimal JRE, no build tools
FROM eclipse-temurin:17-jre-alpine

# Security: Create non-root user
RUN addgroup -g 1001 zynctra &&     adduser -D -u 1001 -G zynctra zynctra &&     mkdir -p /var/log/zynctra &&     chown -R zynctra:zynctra /var/log/zynctra

# Security: Minimal runtime packages only
RUN apk add --no-cache     libstdc++     curl     && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy artifact from builder
COPY --from=builder /build/target/performance-service-*.jar app.jar

# Security: Restrict file permissions
RUN chown -R zynctra:zynctra /app &&     chmod 500 /app/app.jar &&     chmod 550 /app

# Security: JVM hardening flags
ENV JAVA_OPTS="-XX:+UseContainerSupport     -XX:MaxRAMPercentage=75.0     -Djava.security.egd=file:/dev/./urandom     -Dspring.backgroundpreinitializer.ignore=true     -Dfile.encoding=UTF-8     -Dspring.devtools.restart.enabled=false     -Dspring.profiles.active=prod"

# Security: Read-only filesystem with tmpfs for temp files
VOLUME ["/tmp"]

USER zynctra

# Health check (non-privileged, non-caching)
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3     CMD curl -sf http://localhost:8083/api/performance/actuator/health || exit 1

EXPOSE 8083

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]