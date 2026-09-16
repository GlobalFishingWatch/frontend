---
name: URL Encoding for Map State
slug: url-encoding-for-map-state
type: system
sources:
  - path: libs/skills/src/encode-url/encode.ts
    hash: 3c70f0e8c88dec308a43fe0ac416deac2c0bc4f53f280657341929425d04d3d1
sources_digest: 702faafa7a618babb2dd9eeeba595ca935e126c29c4ee20a3b8ea7ffc9d662cb
links:
  - to: dataset-version-resolution
    relation: uses
    description: Calls resolveDataviewSlug to inject dataset version into dataview IDs
  - to: encode-url-routes-routing-utilities
    relation: uses
    description: >-
      Uses getRouteNavigation to convert MapRoute to TanStack Router navigation
      objects
  - to: geospatial-layer-dictionary
    relation: uses
    description: >-
      Calls getLayerInfo to resolve layer library IDs to semantic dataview
      identifiers
generator:
  version: 1
covers:
  - symbol: withDataviewId
    kind: function
    at: 'libs/skills/src/encode-url/encode.ts:L20-L31'
  - symbol: withSnappedTimeRange
    kind: function
    at: 'libs/skills/src/encode-url/encode.ts:L35-L47'
  - symbol: withReportContextLayers
    kind: function
    at: 'libs/skills/src/encode-url/encode.ts:L58-L78'
  - symbol: withAisDefaultFilters
    kind: function
    at: 'libs/skills/src/encode-url/encode.ts:L83-L103'
  - symbol: MapState
    kind: type
    at: 'libs/skills/src/encode-url/encode.ts:L105-L105'
  - symbol: EncodeMapUrlInput
    kind: type
    at: 'libs/skills/src/encode-url/encode.ts:L107-L112'
  - symbol: EncodeMapUrlResult
    kind: type
    at: 'libs/skills/src/encode-url/encode.ts:L114-L119'
  - symbol: encodeMapUrl
    kind: function
    at: 'libs/skills/src/encode-url/encode.ts:L121-L142'
---

<!-- context:generated:start -->

## Summary

Encodes map application state (route, workspace, viewport, time, layers) into shareable URLs. encodeMapUrl orchestrates state normalization: snapping time ranges to fourwings intervals, resolving missing dataview IDs, injecting report-context layers, and preserving AIS distance-filter defaults when custom filters apply.

## Related

- uses [[dataset-version-resolution]] — Calls resolveDataviewSlug to inject dataset version into dataview IDs
- uses [[encode-url-routes-routing-utilities]] — Uses getRouteNavigation to convert MapRoute to TanStack Router navigation objects
- uses [[geospatial-layer-dictionary]] — Calls getLayerInfo to resolve layer library IDs to semantic dataview identifiers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
