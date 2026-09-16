---
name: Spinner loading indicator
slug: spinner-loading-indicator
type: system
sources:
  - path: libs/ui-components/src/spinner/index.ts
    hash: ce75a0b6a21548e3c0c57278c11150a552e3200ac71c65db0c7c8a78a357763a
  - path: libs/ui-components/src/spinner/Spinner.tsx
    hash: 6b0164c47113c6d5ed6fdc3a9cbfbf86d070970ed0c7f386760cb25ec15fc8af
sources_digest: de6bc5497a6deec74697ae60674bd149eca1def03b4faff435dcc6bf8d725238
links: []
generator:
  version: 1
covers:
  - symbol: SpinnerProps
    kind: interface
    at: 'libs/ui-components/src/spinner/Spinner.tsx:L6-L11'
  - symbol: Spinner
    kind: function
    at: 'libs/ui-components/src/spinner/Spinner.tsx:L15-L41'
---

<!-- context:generated:start -->

## Summary

Reusable animated SVG loading indicator with configurable size, color, and layout. Spinner.tsx manages size-based radius calculation (default radius 20, smaller variants radius 8), applies inline stroke color for runtime customization, and switches between bare SVG or centered-div layout via the `inline` prop. The module exports through an index barrel.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
