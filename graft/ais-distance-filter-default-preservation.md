---
name: AIS Distance Filter Default Preservation
slug: ais-distance-filter-default-preservation
type: concept
sources:
  - path: libs/skills/src/encode-url/encode.ts
    hash: 3c70f0e8c88dec308a43fe0ac416deac2c0bc4f53f280657341929425d04d3d1
sources_digest: 702faafa7a618babb2dd9eeeba595ca935e126c29c4ee20a3b8ea7ffc9d662cb
links:
  - to: url-encoding-for-map-state
    relation: implements
    description: withAisDefaultFilters applies this preservation logic
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

When encoding URLs with custom AIS layer filters, withAisDefaultFilters ensures the server's implicit distance_from_port_km=3 filter is explicitly injected to prevent accidental charting of anchored vessels. This is necessary because URL-provided filters override server defaults, requiring explicit preservation of the default constraint.

## Related

- implements [[url-encoding-for-map-state]] — withAisDefaultFilters applies this preservation logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
