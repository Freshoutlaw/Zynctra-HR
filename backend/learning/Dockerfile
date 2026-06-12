FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && \
    mvn dependency:go-offline -B && \
    mvn clean package -DskipTests -B && \
    java -Djarmode=layertools -jar target/learning-service-*.jar extract

FROM eclipse-temurin:17-jre-alpine
LABEL org.opencontainers.image.title="Zynctra Learning Service" \
      org.opencontainers.image.description="Self-defending AI learning platform" \
      org.opencontainers.image.vendor="Zynctra" \
      org.opencontainers.image.version="1.0.0"

RUN addgroup -S -g 1000 zynctra && \
    adduser -S -u 1000 -G zynctra -s /sbin/nologin -D zynctra && \
    mkdir -p /app /tmp /var/log/zynctra /app/threat-patterns && \
    chown -R zynctra:zynctra /app /tmp /var/log/zynctra

WORKDIR /app

COPY --from=builder --chown=zynctra:zynctra /build/dependencies/ ./
COPY --from=builder --chown=zynctra:zynctra /build/spring-boot-loader/ ./
COPY --from=builder --chown=zynctra:zynctra /build/snapshot-dependencies/ ./
COPY --from=builder --chown=zynctra:zynctra /build/application/ ./

COPY src/main/resources/threat-patterns/ /app/threat-patterns/
RUN chmod -R 500 /app/threat-patterns/

RUN chmod -R 500 /app && find /app -type d -exec chmod 500 {} \; && \
    apk del --purge apk-tools 2>/dev/null || true && \
    rm -rf /var/cache/apk/* /usr/bin/wget /usr/bin/curl 2>/dev/null || true

USER zynctra:zynctra

ENV JAVA_OPTS="-server -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 \
    -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -Djava.security.egd=file:/dev/./urandom \
    -Dspring.backgroundpreinitializer.ignore=true -Dspring.jmx.enabled=false \
    -Djava.awt.headless=true -Dfile.encoding=UTF-8 -Dlog4j2.formatMsgNoLookups=true \
    -XX:+DisableAttachMechanism -Djdk.attach.allowAttachSelf=false \
    -Dthreat.patterns.path=/app/threat-patterns"

ENV SPRING_PROFILES_ACTIVE=production \
    SERVER_PORT=8085 \
    MANAGEMENT_SERVER_PORT=8086

EXPOSE 8085 8086

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8085/api/learning/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]