/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

module.exports = {
  //additional prop from a github issue: https://github.com/zeit/next.js/issues/8663
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires.  you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    "ts-jest": {
      tsConfig: "tsconfig.jest.json",
    },
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/",
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    // Mock antd import
    "antd/dist/antd.less": "<rootDir>/config/jest/cssTransform.js",
    "../styles/globals.less": "<rootDir>/config/jest/cssTransform.js",
    "package.json": "<rootDir>/config/jest/packageTransform.js",
    // Path aliases, same as in tsconfig.json
    "@components(.*)$": "<rootDir>/src/components$1",
    "@pages(.*)$": "<rootDir>/src/pages$1",
    "@models(.*)$": "<rootDir>/src/models$1",
    "@helpers(.*)$": "<rootDir>/src/helpers$1",
    "@tests(.*)$": "<rootDir>/tests$1",
  },
  setupFiles: [
    "<rootDir>/node_modules/jest-fetch-mock/setupJest.js"
  ],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/docs/"
  ],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!*.config.js",
    "!.eslintrc.js"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/config/",
    "/coverage/",
    "/docs/",
    "/src/pages/api/"
  ],
  automock: false
};
