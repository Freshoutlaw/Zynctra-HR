FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app
COPY backend/pom.xml .
COPY backend/*/pom.xml ./
RUN mvn dependency:go-offline
COPY backend/ ./
RUN mvn clean package -DskipTests
FROM openjdk:17-jre-slim
COPY --from=builder /app/*/target/*.jar /app/app.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/app.jar"]
