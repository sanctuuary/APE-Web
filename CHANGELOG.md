# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The domain name is now shown on the domain explore page.
- Notification explaining how to navigate the workflows on the explore page appears when the user selects more workflows for the first time.
- Add .cff and .bib citation files.

### Fixed

- OntologyTreeSelect's dropdown is now wider to fit all items.
- OntologyTreeSelect now better handles items with the same name.
- Several errors surrounding the constraint sketcher.
- APE synthesis flag messages sometimes being empty.
- OntologyTreeSelect search function.
- First tree node in OntologyTreeSelect not expanding by default.

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
[1.3.2]: https://github.com/sanctuuary/APE-Web/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/sanctuuary/APE-Web/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/sanctuuary/APE-Web/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/sanctuuary/APE-Web/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/sanctuuary/APE-Web/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/sanctuuary/APE-Web/releases/tag/v1.0.0
