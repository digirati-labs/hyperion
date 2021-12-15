# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/digirati-labs/hyperion/compare/v1.1.0...master)

### Added
- Added missing IIIF selector extensions to types (https://iiif.io/api/annex/openannotation/)
- Added new "Meta" section of vault state
- Added additional traversal of inline annotations on a canvas
- Added new `Vault.requestStatus()` API for requesting status of an HTTP resource request
- Added new `Vault.getResourceMeta()` API for getting metadata for a resource
- Added new `Vault.setResourceMeta()` API for setting metadata for a resource
- Added new `Vault.addEventListener()` API for setting event listeners on a resource metadata
- Added new `Vault.removeEventListener()` API for removing event listeners on a resource metadata

### Fixed
- Fixed normalised `.annotations` property type (`Annotation` -> `AnnotationPage`)
- Fixed missing `behavior` when upgrading Presentation 2 to 3
- Fixed subscription refreshing when changes are made to vault
- Fixed unmounting error in `useThumbnail`
