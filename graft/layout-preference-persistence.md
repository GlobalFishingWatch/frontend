---
name: Layout Preference Persistence
slug: layout-preference-persistence
type: concept
sources:
  - path: apps/platform/server-functions/screen-size.functions.ts
    hash: 363038102f6d758a497118ce06d98a2e20b8bb9ffff354127e6bca309dad4b0e
sources_digest: 18586829e638f161ab0b667ccf0e4fd59b2e23141fd48d8bfaf0dc9c8c30e619
links: []
generator:
  version: 1
covers:
  - symbol: clampAsidePct
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L7-L7'
  - symbol: clampContentPanelWidth
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L11-L12'
  - symbol: detectPanelWidthsFromRequest
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L14-L33'
  - symbol: getPanelWidthsFromRequest
    kind: function
    at: 'apps/platform/server-functions/screen-size.functions.ts:L35-L38'
---

<!-- context:generated:start -->

## Summary

Panel layout dimensions (sidebar %, content width px, screen width) are stored in a browser cookie (PANEL_WIDTHS_COOKIE_KEY) and restored server-side during SSR via detectPanelWidthsFromRequest. Values are clamped to safe ranges (sidebar 33–66%, content 320–800px) to prevent layout breakage.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
