---
name: Screenshot Configuration
slug: screenshot-configuration
type: file
sources:
  - path: apps/platform/features/_map/map/controls/screenshot.slice.ts
    hash: 7e58f649122da946018fcfac587287870c5a63b394f6550dfa1379b80621b42e
sources_digest: 4e760c729da13f14c920453b599b833bc7ba071a517f13cee4652898c018b0e7
links:
  - to: map-controls-system
    relation: configures
    description: >-
      Configures which DOM area is captured when MapControlScreenshot trigger a
      screenshot
generator:
  version: 1
covers:
  - symbol: ScrenshotArea
    kind: type
    at: 'apps/platform/features/_map/map/controls/screenshot.slice.ts:L11-L11'
  - symbol: ScrenshotDOMArea
    kind: type
    at: 'apps/platform/features/_map/map/controls/screenshot.slice.ts:L12-L13'
  - symbol: ScreenshotState
    kind: interface
    at: 'apps/platform/features/_map/map/controls/screenshot.slice.ts:L24-L26'
  - symbol: getInitialState
    kind: function
    at: 'apps/platform/features/_map/map/controls/screenshot.slice.ts:L28-L38'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/_map/map/controls/screenshot.slice.ts:L63-L63'
---

<!-- context:generated:start -->

## Summary

Redux slice managing screenshot capture area selection and user preferences. Persists the user's screenshot area choice (map only, with timebar, with legend) to localStorage on boot, falling back to default if storage is unavailable.

## Related

- configures [[map-controls-system]] — Configures which DOM area is captured when MapControlScreenshot trigger a screenshot

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
