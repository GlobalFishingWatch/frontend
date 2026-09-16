---
name: Geometry Simplification Tradeoffs
slug: geometry-simplification-tradeoffs
type: concept
sources:
  - path: libs/ocean-areas/src/scripts/lib/simplify.ts
    hash: 2cb57b9d7897b06047092d688e48e4ed0536a3d541ed361a36e94df943aabe1b
sources_digest: 923cc0d8f851dbf22d41645bfbe2b15cedcc247778b4016b71cb99dd3a0cf88c
links: []
generator:
  version: 1
covers:
  - symbol: simplifyArea
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/simplify.ts:L6-L66'
---

<!-- context:generated:start -->

## Summary

Design decision to fix tolerance and precision values rather than expose as configuration: Turf.js simplify tolerance hardcoded to 0.3, coordinate decimals to 2. Trades geometric accuracy for file size reduction and consistent output across all datasets.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
