# APE Web - front-end

This the front-end of the APE Web project.

## Requirements

To run APE Web you need to have [Node.js 12](https://nodejs.org) (or higher) installed on your system (use command `$ node --version` to check your local version).

For instructions for Docker, please see the README file in the project root.

### Running the APE Web front-end

To setup up the APE Web front-end on your own machine, follow these steps:
1. In this directory, create a `.env.production.local` file (we recommend copying the provided `.env` file).
2. Fill in the configuration paremeters in this file.
3. In this directory, run `npm run build` to create a production build.
4. In this directory, run `npm run start` to start the webserver.

**Note**: do not forget to also set up the back-end.
The front-end cannot function without the back-end.
Instructions on setting up the back-end can be found in the back-end's README.
