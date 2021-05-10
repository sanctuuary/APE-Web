# APE Web - back-end

This the back-end of the APE Web project.

## Requirements

To run the APE Web back-end you need to have [Java 11](https://www.oracle.com/java/technologies/javase-downloads.html#JDK11) (or higher) installed on your system (use command `$ java -version` to check your local version),
and a [MongoDB database](https://www.mongodb.com/try/download/community).

To build the APE Web back-end from source, [Maven 3.3+](https://maven.apache.org/download.cgi) has to be installed as well (use command `$ mvn -version` to check your local version).

For instruction for Docker, please see the README file in the project root.

### Build APE Web back-end from source

In this directory, simply run:
````shell
$ mvn package -DskipTests=true
````

#### Production build

When hosting the server in production, we recommend making a production build.
To do so, create a new file called `application-prod.properties` in `src/main/resources`.
Add the following lines:
````shell
server.error.include-stacktrace=never
spring.data.mongodb.database=ape
spring.data.mongodb.authentication-database=admin
spring.data.mongodb.uri=mongodb://admin:admin@localhost:27017/?authSource=admin
````
The first line prevents the back-end from sending the full stack trace to in request responses.
The second line is the name of the mongodb database to connect to.
The third line is the name of the authentication database of mongodb.
In the last line, you can replace `admin:admin@localhost:27017` to configure the login credentials and IP address + port for the mongodb database server.

Now build the back-end with the production profile using:
````shell
$ mvn package -DskipTests=true -P prod
````

#### Building with a specific APE version

Please note that not every version of APE is guaranteed to work with every version of APE Web.
Select a different version of APE at your own risk.

If you wish to use APE Web with a specific version of APE, it can be done by modifiying the `pom.xml` file.
In this file, change the APE version:
```xml
<dependency>
    <groupId>io.github.sanctuuary</groupId>
    <artifactId>APE</artifactId>
    <version>1.1.7</version> <!-- Change this version to the preferred version -->
</dependency>
```
If the APE version you wish to use is not available on the [Mvn repository](https://mvnrepository.com/artifact/io.github.sanctuuary/APE)
you can install APE in your local repository and use it to build the back-end.
To do so, [download](https://github.com/sanctuuary/APE#releases)
or [compile](https://github.com/sanctuuary/APE#build-ape-from-source-using-maven) the APE version you wish to use.
In the location where you have the resulting APE.jar file, run the following command:
````shell
$ mvn install:install-file -Dfile=APE-<version>.jar
````
This adds the specified APE file to your local Maven repository.
You can now build the back-end using:
````shell
$ mvn package -DskipTests=true
````
