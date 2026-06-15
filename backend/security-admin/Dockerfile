# backend/security-admin/Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /build
RUN apk add --no-cache bash
COPY . .
RUN ./mvnw clean package -DskipTests -Dspring.profiles.active=prod

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -g 1001 zynctra && \
    adduser -D -u 1001 -G zynctra zynctra && \
    mkdir -p /var/log/zynctra && \
    chown -R zynctra:zynctra /var/log/zynctra

RUN apk add --no-cache libstdc++ curl && rm -rf /var/cache/apk/*

WORKDIR /app
COPY --from=builder /build/target/security-admin-service-*.jar app.jar
RUN chown -R zynctra:zynctra /app && chmod 500 /app/app.jar

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 \
    -Djava.security.egd=file:/dev/./urandom -Dfile.encoding=UTF-8 \
    -Dspring.profiles.active=prod -Dspring.beaninfo.ignore=true"

VOLUME ["/tmp"]
USER zynctra

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -sf http://localhost:8085/api/security-admin/actuator/health || exit 1

EXPOSE 8085
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]