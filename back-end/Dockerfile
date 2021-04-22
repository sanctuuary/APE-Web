# This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
# © Copyright Utrecht University (Department of Information and Computing Sciences)
FROM maven:3.6.3-adoptopenjdk-11
WORKDIR /app
COPY pom.xml /app
COPY APE-*.jar /app/
# Install APE 1.1.7 locally, as it's currently not available in the online maven repository
RUN mvn install:install-file -Dfile="APE-1.1.7.jar"
RUN mvn compile
COPY . /app
RUN mvn package -DskipTests=true -P docker
ENTRYPOINT ["java", "-jar", "target/backend-1.0.0.jar"]
