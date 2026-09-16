---
name: Artifact Comparisons & Visual Regression
slug: artifact-comparisons-visual-regression
type: concept
sources:
  - path: apps/platform-e2e/src/screenshots/screenshots.e2e.spec.ts
    hash: 806bd5661c2f52877e19760bab3ad9dc37c6bd2d7ca3a3aad43ca266ff2d4c18
sources_digest: 2a2aefd020e1650b3822b3e549e8877d752fbd757913f9fa2ac1af4f6651d81d
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Pattern of using Playwright's `expect(page).toHaveScreenshot()` with low maxDiffPixels tolerance (2px) to detect unintended UI regressions, balanced against dynamic content by pre-setting localStorage state (suppress popups), injecting fixed render delays, and commenting out mask selectors for elements that legitimately vary over time.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
