---
name: Timebar Library Integration
slug: timebar-library-integration
type: concept
sources:
  - path: apps/platform/features/_map/timebar/TimebarActivityGraph.tsx
    hash: d4acb42ef57588c830cdea67038a0b266e2337e21e5d8620ca631cb53b8b92ca
  - path: apps/platform/features/_map/timebar/TimebarClusterEventsGraph.tsx
    hash: fbc4eead49c307101859945e57b927e93134bd56e66730a5073fdce57c6cfa7e
  - path: apps/platform/features/_map/timebar/TimebarPointsGraph.tsx
    hash: 3d6f6583b732bd1d8e190482372cac779992c6ced1e28585356edbcc3a9a626f
sources_digest: 8e802bef6c1704793714402803029cb2370a62642be36502a62dcd01221a60a5
links:
  - to: timebar-utility-pipeline
    relation: depends_on
    description: >-
      All timebar components depend on utility functions to produce
      properly-formatted ActivityTimeseriesFrame data
generator:
  version: 1
covers:
  - symbol: TimebarActivityGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarActivityGraph.tsx:L11-L56'
  - symbol: TimebarClusterEventsGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarClusterEventsGraph.tsx:L19-L60'
  - symbol: TimebarPointsGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarPointsGraph.tsx:L12-L52'
---

<!-- context:generated:start -->

## Summary

Abstraction layer wrapping @globalfishingwatch/timebar's StackedActivity chart component, used consistently across activity, cluster events, and points timebars. Components provide data via ActivityTimeseriesFrame arrays, color scaling functions (numeric → RGBA), and callback interfaces for tooltip formatting and icon mapping. The library expects data pre-binned into time intervals and handles chart rendering, interaction, and animation. Critical invariant: all data sources feeding into timebars must conform to ActivityTimeseriesFrame schema with matching time bin boundaries.

## Related

- depends on [[timebar-utility-pipeline]] — All timebar components depend on utility functions to produce properly-formatted ActivityTimeseriesFrame data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
