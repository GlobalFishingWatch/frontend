---
name: E2E Test Suite
slug: e2e-test-suite
type: system
sources:
  - path: apps/platform-e2e/src/screenshots/screenshots.e2e.spec.ts
    hash: 806bd5661c2f52877e19760bab3ad9dc37c6bd2d7ca3a3aad43ca266ff2d4c18
  - path: apps/platform-e2e/src/seed.spec.ts
    hash: a46fe6b1aaf591ff7fd4a092b9aa50e072f69bbba24e6dd30c844f5c3a683eb2
  - path: apps/platform-e2e/src/tests/LoginFlow.e2e.spec.ts
    hash: 00af142164291708db8241d71dccbe2870b74daf554f27c3e3d69583e19c8c32
  - path: apps/platform-e2e/src/tests/Map.e2e.spec.tsx
    hash: 83c45cab3ac4d002b03b22d3783ab5ea263e55be1773d51c3ce2b85597dd6f56
  - path: apps/platform-e2e/src/tests/Report.e2e.spec.tsx
    hash: f680a56ff419150e2fec83198da0b3bd0a33135d38853db7155876501cf393b6
  - path: apps/platform-e2e/src/tests/VesselProfile.e2e.spec.tsx
    hash: 9f5486a2b2507879f574071c1cc4cee25e9816fce531a30d91c044d252225e43
  - path: apps/platform-e2e/src/tests/VesselSearch.e2e.spec.tsx
    hash: 0add49879e6a5e0da6b7314507f36b9d8da8e22c2c5812982848df4f365772ae
  - path: apps/platform-e2e/src/tests/Workspace.e2e.spec.tsx
    hash: 3a19cddb154342661b24868b8a429c74fdef1201417cccab09f30f0d9f5230d5
sources_digest: 507955be028df1571567bce921f145f95981b9f65cc460b30e60b1f107d459d4
links:
  - to: artifact-comparisons-visual-regression
    relation: implements
    description: >-
      Screenshots.spec.ts establishes pixel-level comparison baselines with
      maxDiffPixels tolerance to detect unintended UI changes across map
      rendering updates
  - to: test-categorization-tags
    relation: uses
    description: >-
      Tests decorate scenarios with TAGS.SMOKE, TAGS.EXTENDED, TAGS.REGRESSION
      to enable selective execution by CI/CD pipelines and local developers
  - to: test-infrastructure-fixtures
    relation: depends_on
    description: >-
      Tests rely on custom Playwright fixtures (loginPage, test runner config)
      and shared utilities (appPath, MAP_PATH) for environment setup and
      navigation
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Playwright-based end-to-end test suite for the platform that validates critical user workflows including authentication, map interactions, vessel search, workspace management, and visual regression detection. Tests are organized by feature (Login, Map, Report, Vessel) with selective tagging (SMOKE, EXTENDED, REGRESSION) for CI/CD stage filtering.

## Related

- implements [[artifact-comparisons-visual-regression]] — Screenshots.spec.ts establishes pixel-level comparison baselines with maxDiffPixels tolerance to detect unintended UI changes across map rendering updates
- uses [[test-categorization-tags]] — Tests decorate scenarios with TAGS.SMOKE, TAGS.EXTENDED, TAGS.REGRESSION to enable selective execution by CI/CD pipelines and local developers
- depends on [[test-infrastructure-fixtures]] — Tests rely on custom Playwright fixtures (loginPage, test runner config) and shared utilities (appPath, MAP_PATH) for environment setup and navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
