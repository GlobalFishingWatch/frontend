---
name: Platform E2E test configuration and utilities
slug: platform-e2e-test-configuration-and-utilities
type: system
sources:
  - path: apps/platform-e2e/src/paths.ts
    hash: 320d04b71920a5e9a36e5ed9759158b7d179c8cb8c6e069a4787c3e39cc71b48
  - path: apps/platform-e2e/src/screenshots/screenshots.config.ts
    hash: 6addd454a57d95931349f777372d72247ff4994989f56f5e1cdb60d8e97d8ac7
sources_digest: cd0daddae114d035f3d5fa040e9ea63e16ac913cc3418a330f163112bae6d2fd
links: []
generator:
  version: 1
covers:
  - symbol: appPath
    kind: function
    at: 'apps/platform-e2e/src/paths.ts:L8-L14'
  - symbol: MapUrl
    kind: type
    at: 'apps/platform-e2e/src/screenshots/screenshots.config.ts:L3-L6'
---

<!-- context:generated:start -->

## Summary

Configuration modules for E2E test execution. paths.ts exports PATH_BASENAME (from PLAYWRIGHT_PATH_BASIS env var, default /platform) and appPath() function to construct app-rooted URLs matching React Router basename, enabling tests to remain deployment-agnostic. screenshots.config.ts provides MAP_URLS registry combining PUBLIC_URLS, MARINE_MANAGER_URLS, and ANALYSTS_URLS—comprehensive baseline configurations for regression testing across public map, 17 coastal marine manager regions, and analyst workspaces with opaque visualization parameters (dvIn, tk, mA arrays). These brittle snapshot URLs must be manually updated if map query schema changes.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
