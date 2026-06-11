# Zynctra API Gateway Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and POM
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY api-gateway/pom.xml api-gateway/

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -pl api-gateway -am

# Copy source code
COPY api-gateway/src/ api-gateway/src/

# Build the application
RUN ./mvnw clean package -pl api-gateway -am -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

# Security: Run as non-root user
RUN addgroup -g 1001 zynctra && \
    adduser -D -u 1001 -G zynctra zynctra

WORKDIR /app

# Copy JAR from builder
COPY --from=builder /build/api-gateway/target/api-gateway-*.jar app.jar

# Set ownership
RUN chown -R zynctra:zynctra /app

USER zynctra

# JVM options for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+OptimizeStringConcat \
               -XX:+UseStringDeduplication \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.backgroundpreinitializer.ignore=true"

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]