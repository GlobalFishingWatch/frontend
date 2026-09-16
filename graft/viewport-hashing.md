---
name: Viewport Hashing
slug: viewport-hashing
type: file
sources:
  - path: libs/deck-layers/src/utils/viewport.ts
    hash: a2425be8c33040a45bbfb6a25d9468b92ad7cd4e3cb79942d16bdc181ee24397
sources_digest: e6e5fb2f9c3851e9cfd8938a19e581a68e2d7198ac9651cca161ccb0ebb9c029
links: []
generator:
  version: 1
covers:
  - symbol: getViewportHash
    kind: function
    at: 'libs/deck-layers/src/utils/viewport.ts:L1-L18'
---

<!-- context:generated:start -->

## Summary

Generates deterministic hash strings from viewport state (zoom, longitude, latitude, width, height) normalized to fixed decimal precision (default 3 digits). Suitable for cache keys or React dependency arrays, avoiding floating-point precision errors by converting to fixed-decimal strings rather than preserving raw float values.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
