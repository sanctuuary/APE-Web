# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.7.0] - 2022-09-02

### Added

- SLTLx editor. It allows writing SLTLx formulas to use as constraints for workflows.

### Changed

- Update front-end Docker container Node.js version 14 -> 16.
- Update APE dependency version 1.1.12 -> 2.0.3.
- Update front-end dependencies, most notably:
  * Ant Design 4.7.0 -> 4.20.6
  * Next.js 9.5.5 -> 12.1.5
  * React 16.14.0 -> 17.0.2
  * ESLint 7.32.0 -> 8.18.0
  * TypeScript 4.4.4 -> 4.7.4
  * eslint-config-airbnb-typescript 11.4.0 -> 17.0.0
- Update back-end dependencies.
  * spring boot 2.3.4 -> 2.6.7
  * owlapi 5.1.17 -> 5.1.20
  * gson 8.6 -> 9.0
  * spring boot starter data mongodb 2.6.2 -> 2.6.7
  * log4j-core 2.17.0 -> 2.17.2
  * log4j-api 2.17.0 -> 2.17.2
  * graphviz-java 0.17.0 -> 0.18.1
  * springmockk 2.0.3 -> 3.1.1
  * json 20200518 -> 20220320
- Update Travis CI Node.js version 14 -> 16.
- Replace placeholder values in .env file of the front-end with working values.

## [1.6.0] - 2022-04-22

### Added

- Domain verification. Domains' ontology and core configuration are verified with an empty run, and use cases are verified to run and give at least one workflow result.

### Fixed

- Buttons "Go back home" and "Go to domain" after creating a domain are now properly centered.

## [1.5.1] - 2021-12-24

### Changed

- Force all dependencies to use log4j and slf4j version 2.17.0.

## [1.5.0] - 2021-12-20

### Added

- Clear buttons to clear all input data, output data, constraints on the explore page.
- Domains can now be permanently deleted in the domain edit page.
- Domains' ontologies and use cases are now verified when created.

### Changed

- Update back-end Kotlin version from 1.3.72 -> 1.6.0.
- Update APE dependency version 1.1.9 -> 1.1.12 (includes log4j vulnerability fix).

### Fixed

- Remove "tab" as suggestion for separating data taxonomy roots as this also moves the user to the next input field. 
- Some dependencies were updated to fix vulnerability issues.
- When there are many inputs, outputs, or constraints on the explore page; a scrollbar will now appear inside the workflow input box to prevent the workflow result from appearing far below.

## [1.4.0] - 2021-11-06

### Added

- The domain name is now shown on the domain explore page.
- Notification explaining how to navigate the workflows on the explore page appears when the user selects more workflows for the first time.

### Changed

- Update APE dependency to 1.1.9.
- Change "CWL (beta)" download to "Abstract CWL" download.
- Make it possible to configure the size limit of file uploads in the .env files (default: 10MB).
- Run parameter field "Max duration (s)" is now "Max duration (seconds)".
- Improved tooltips on the domain creation page.
- Improved tooltips on the domain edit page.

### Fixed

- OntologyTreeSelect's dropdown is now wider to fit all items.
- OntologyTreeSelect now better handles items with the same name.
- Several errors surrounding the constraint sketcher.
- APE synthesis flag messages sometimes being empty.
- OntologyTreeSelect search function.
- First tree node in OntologyTreeSelect not expanding by default.
- Run parameter fields are now required.

## [1.3.3] - 2021-11-02

This release is paired with the APE Web [DOI release](https://zenodo.org/badge/latestdoi/360515462).

## [1.3.2] - 2021-08-09

### Fixed

- Public domains can be explored again without logging in.
- Add missing "no access" result page when trying to explore a domain a user does not have access to.

## [1.3.1] - 2021-08-09

### Added

- The current ontology, tools annotations, use case config, and use case constraints files of a domain can now be downloaded on the domain edit page.

### Changed

- Visibility and "use strict tool annotations" fields on create domain page now have default values.
- File uploads when creating and editing domains now filter accepted file types in the file dialog.
- User is now redirected to the home page after successfully creating a domain.

### Fixed

- Uploading use case run configuration and constraints file on the create domain page.
- Uploading new a use case run configuration or constraints file on the domain edit page.
- NaN value in run parameters when a use case run configuration does not contain a value for the parameter.
- HTML "text" tag error on the explore page.
- Incorrect unauthorized response when exploring private domains.
- Add missing "use strict tools annotations" field to the domain edit page.

## [1.3.0] - 2021-07-28

### Added

- Column to public domains list which shows the owner of the domain.
- Official domains are shown with an "official" topic.

### Changed

- Update APE dependency to 1.1.8.
- Rewrote workflow visualization code to fix overlapping nodes.

### Fixed

- Filtering domains based on their topics.
- Less console errors when a domain has no use case.

## [1.2.0] - 2021-07-06

### Added

- Grant or revoke administrator privileges to / from users in the administrator page.
- Manage access to a domain in the domain edit page.
- Endpoint for changing the administrator status of users.
- (Admin only) endpoint for getting a list of all users.
- Endpoint to get all users with certain access to a domain.
- Endpoint to set a user's access to a domain.
- Endpoint to transfer the ownership of a domain.

### Changed

- More specific error messages are shown when a workflow run / synthesis gets interrupted.
- Change occurrences of "APE Web View" to "APE Web".
- Moved front-end Docker container from Node.js 12 to Node.js 14.
- Logging of back-end tests is less verbose (information about the tests themselves is not affected).
- User's email addresses are no longer included in responses from the back-end by default (previously email addresses were also only given when necessary).

### Fixed

- Test application.properties of back-end was in the wrong location.
- The 403 result on the domain edit page now redirects to the home page instead of a non-existent page.

## [1.1.0] - 2021-05-28

### Added
- A link to the official running instance of APE Web in the README.
- CHANGELOG.md file.
- Terms and conditions page.
- Endpoint to GET global run parameters limits.
- Endpoint to PUT new global run parameters limits.
- Front-end gets run parameters limits from back-end.
- Admin page allows configuring the global run parameters limits.
- Back-end checks if a workflow run does not exceed the configured run parameters limits.
- Project version is shown in footer.

### Changed
- Removed required steps to install APE 1.1.7 to local Maven repository, replaced with instructions to optionally use a different version of APE when compiling the back-end.
- Update the footer links to point to the APE Web GitHub repository.
- Reduced the size of the headers on the admin page.

### Removed
- Vacancies link in footer.
- PostCSS (because it was not used).
- Sass (all CSS is now in Less).

### Fixed
- Domain upload creating corrupted domains.
- "Sign out" button in header.
- "Go to login" on admin page's unauthorized result.
- Max run duration being the max length/steps when downloading configuration files.
- Unknown "text" HTML element error on explore page.

## [1.0.0] - 2021-05-03

### Added
- Public and private domains.
- User accounts.
- Administrator accounts.
- Domain creation page.
- Domain edit page.
- Explore page.
  * Configure and run APE.
  * Uploading and downloading workflow run configurations.
  * Preset use case run configurations.
  * Constraint sketcher.
  * Workflow comparison.
  * Workflow bash script downloading.
  * Workflow graph PNG downloading.
- Administration page.
  * Add topics.
  * Approve user accounts.
  
[Unreleased]: https://github.com/sanctuuary/APE-Web/compare/master...dev
[1.7.0]: https://github.com/sanctuuary/APE-Web/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/sanctuuary/APE-Web/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/sanctuuary/APE-Web/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/sanctuuary/APE-Web/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/sanctuuary/APE-Web/compare/v1.3.3...v1.4.0
[1.3.3]: https://github.com/sanctuuary/APE-Web/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/sanctuuary/APE-Web/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/sanctuuary/APE-Web/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/sanctuuary/APE-Web/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/sanctuuary/APE-Web/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/sanctuuary/APE-Web/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/sanctuuary/APE-Web/releases/tag/v1.0.0
