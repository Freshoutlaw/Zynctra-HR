FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY analytics-service/pom.xml analytics-service/

RUN ./mvnw dependency:go-offline -pl analytics-service -am

COPY analytics-service/src/ analytics-service/src/

RUN ./mvnw clean package -pl analytics-service -am -DskipTests

FROM eclipse-temurin:17-jre-alpine

RUN addgroup -g 1001 zynctra && adduser -D -u 1001 -G zynctra zynctra

WORKDIR /app

COPY --from=builder /build/analytics-service/target/analytics-service-*.jar app.jar

RUN chown -R zynctra:zynctra /app

USER zynctra

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+OptimizeStringConcat -XX:+UseStringDeduplication -Djava.security.egd=file:/dev/./urandom"

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8090/actuator/health || exit 1

EXPOSE 8090

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]