# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/digirati-labs/hyperion/compare/v1.1.0...master)

### Added
- Added missing IIIF selector extensions to types (https://iiif.io/api/annex/openannotation/)
- Added new "Meta" section of vault state
- Added additional traversal of inline annotations on a canvas

### Fixed
- Fixed normalised `.annotations` property type (`Annotation` -> `AnnotationPage`)
