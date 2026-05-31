# Etapa 1: Compilar la aplicación usando Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Descargar las dependencias (ayuda a cachear)
RUN mvn dependency:go-offline
COPY src ./src
# Construir el .jar saltándose los tests
RUN mvn clean package -DskipTests

# Etapa 2: Ejecutar la aplicación con una imagen más ligera
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copiar el .jar compilado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar
# Exponer el puerto (opcional para documentación, Render inyecta PORT)
EXPOSE 8081
# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
