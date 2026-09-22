---
name: Time Range Snapping to Fourwings Intervals
slug: time-range-snapping-to-fourwings-intervals
type: concept
sources:
  - path: libs/skills/src/encode-url/encode.ts
    hash: 3c70f0e8c88dec308a43fe0ac416deac2c0bc4f53f280657341929425d04d3d1
sources_digest: 702faafa7a618babb2dd9eeeba595ca935e126c29c4ee20a3b8ea7ffc9d662cb
links:
  - to: url-encoding-for-map-state
    relation: implements
    description: withSnappedTimeRange applies this normalization
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

withSnappedTimeRange normalizes start/end dates to fourwings interval boundaries: month-aligned for year-span ranges, day-aligned for shorter ranges. This ensures URLs encode canonical time boundaries that align with backend rendering intervals, improving cache hit rates and visual consistency across platforms.

## Related

- implements [[url-encoding-for-map-state]] — withSnappedTimeRange applies this normalization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
