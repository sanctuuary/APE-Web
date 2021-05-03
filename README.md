# APE Web

[APE](https://github.com/sanctuuary/APE) is a command line tool and Java API for the automated exploration of possible computational pipelines (scientific workflows) from large collections of computational tools.

This project is APE Web, the web interface for APE.
It consists of a separate front-end and back-end, which can be found in their own respective directories.
For details regarding the front-end and back-end specifically, please see their README files.

## Requirements

To run APE web, the front-end requires [Node.js](https://nodejs.org) and the back-end requires [Java](https://www.oracle.com/java/technologies/javase-downloads.html#JDK11).
Full details can be found in their own respective README files.

The full project can also be run using Docker Compose.
See the docker-compose.yml file for a basic setup.

## Using APE Web

A running instance of APE Web can be found [here](https://ape.science.uu.nl).
It is set up with different use cases from the [APE Use Cases Repository](https://github.com/sanctuuary/APE_UseCases).

### Using Docker

Currently, the APE Web back-end uses a version of APE which is not available on the Maven repository.
To be able to build the back-end container, please download and build [APE 1.1.7](https://github.com/sanctuuary/APE/releases/tag/v1.1.7) first,
and place it in the back-end directory.

APE Web can be easily deployed using Docker Compose, simply by running:
```shell
docker-compose up -d
```
An initial admin account on the website can be created using the instructions in `scripts/README.md`.

If you wish to change the configuration of the front-end and/or back-end first, please read their README's for instructions.

## The APE Web team

This project was initially developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.

Currently, it is being maintained by:
* Vedran Kasalica (v.kasalica[at]uu.nl), lead developer
* Koen Haverkort, student developer
* Anna-Lena Lamprecht (a.l.lamprecht[at]uu.nl), project initiator and principal investigator

## Contact

For any questions concerning APE please get in touch with Vedran Kasalica (v.kasalica[at]uu.nl).

## Contributions

We welcome contributions (bug reports, bug fixes, feature requests, extensions, use cases, ...) to APE.
Please get in touch with Vedran Kasalica (v.kasalica@uu.nl) to coordinate your contribution.
We expect all contributors to follow our Code of Conduct.

## License

APE Web is licensed under the Apache 2.0 license.
