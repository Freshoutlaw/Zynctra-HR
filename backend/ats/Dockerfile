FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8004

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
