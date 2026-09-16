---
name: Ocean Areas API
slug: ocean-areas-api
type: system
sources:
  - path: apps/platform/routes/api/ocean-areas/index.ts
    hash: faa2b4b7bccd86e5b43e85081e0e4dbac7a40c882caa38eeb2d5477f7eee5a34
  - path: apps/platform/routes/api/ocean-areas/name.ts
    hash: 47f6189c968bcaf0ff0733627149ba8a7f68fd8b6fc78602874e64e5270c9cfe
  - path: apps/platform/routes/api/ocean-areas/search.ts
    hash: 9c2edf6502ae79c0e841c3f41f64b13e6e56ad9dd6399a67a6661d4734945e15
sources_digest: 8ebca0336d243caecebe9fa7b870bc4f02395e056f74c52f5f7c89f5b98a5ca0
links: []
generator:
  version: 1
covers:
  - symbol: OceanAreasApiInfo
    kind: type
    at: 'apps/platform/routes/api/ocean-areas/index.ts:L3-L16'
  - symbol: GetOceanAreaNameRequest
    kind: type
    at: 'apps/platform/routes/api/ocean-areas/name.ts:L5-L11'
  - symbol: GetOceanAreaNameResponse
    kind: type
    at: 'apps/platform/routes/api/ocean-areas/name.ts:L13-L17'
  - symbol: SearchOceanAreasRequest
    kind: type
    at: 'apps/platform/routes/api/ocean-areas/search.ts:L9-L13'
  - symbol: SearchOceanAreasResponse
    kind: type
    at: 'apps/platform/routes/api/ocean-areas/search.ts:L15-L19'
---

<!-- context:generated:start -->

## Summary

Server-side endpoints for geographic area lookup: /api/ocean-areas/ provides endpoint documentation, /api/ocean-areas/name resolves coordinates to area names, and /api/ocean-areas/search finds areas by query string with locale/type filtering. Delegates to @globalfishingwatch/ocean-areas library.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
