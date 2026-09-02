FROM eclipse-temurin:25-jdk-alpine

WORKDIR ./app

COPY target/SiteFinanceiro-0.0.1-SNAPSHOT.jar /app/SiteFinanceiro-0.0.1-SNAPSHOT.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/SiteFinanceiro-0.0.1-SNAPSHOT.jar"]