# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- A link to the official running instance of APE Web in the README.
- CHANGELOG.md file.

### Changed
- Remove required steps to install APE 1.1.7 to local Maven repository, replace with instructions to optionally use a different version of APE when compiling the back-end.
- Update the footer links to point to the APE Web GitHub repository.

### Fixed
- Domain upload creating corrupted domains.
- "Sign out" button in header.
- "Go to login" on admin page's unauthorized result.

## 1.0.0 - 2021-05-03

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