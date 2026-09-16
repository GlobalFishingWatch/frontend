---
name: Geometry Simplification
slug: geometry-simplification
type: file
sources:
  - path: libs/ocean-areas/src/scripts/lib/simplify.ts
    hash: 2cb57b9d7897b06047092d688e48e4ed0536a3d541ed361a36e94df943aabe1b
sources_digest: 923cc0d8f851dbf22d41645bfbe2b15cedcc247778b4016b71cb99dd3a0cf88c
links:
  - to: geometry-simplification-tradeoffs
    relation: implements
    description: >-
      Hardcoded tolerance (0.3) and decimal precision (2) reflect fixed
      accuracy/file-size tradeoff decision
generator:
  version: 1
covers:
  - symbol: simplifyArea
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/simplify.ts:L6-L66'
---

<!-- context:generated:start -->

## Summary

Provides configurable GeoJSON geometry reduction via three modes: simplified polygon (Turf.js with 0.3 tolerance and 2 decimal precision), bounding box polygon, or single point. Handles MultiPolygons by extracting only outer rings to eliminate holes.

## Related

- implements [[geometry-simplification-tradeoffs]] — Hardcoded tolerance (0.3) and decimal precision (2) reflect fixed accuracy/file-size tradeoff decision

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
