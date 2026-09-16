---
name: Search Result Activation
slug: search-result-activation
type: concept
sources:
  - path: apps/platform/features/_map/map/controls/MapSearch.tsx
    hash: e5664efb8d6bf474434bc5e2514af5eed388a145f604d080b3bbcee82f3392f2
sources_digest: e98a79cfe112b9c63e2b9625e109c7ed50100e18077a23790f8b4929c119efd4
links:
  - to: dataview-state-management
    relation: uses
    description: Activates dataview instances when search results are selected
  - to: map-controls-system
    relation: implements
    description: Provides the MapSearch component that activates search results
  - to: map-viewport-management
    relation: uses
    description: Triggers fitBounds or setMapViewState to pan/zoom to search results
generator:
  version: 1
covers:
  - symbol: MapSearch
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L34-L220'
  - symbol: onSelectResult
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L50-L89'
  - symbol: onInputChange
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L91-L108'
---

<!-- context:generated:start -->

## Summary

Pattern for converting search results into active map layers or viewport changes. MapSearch classifies results as context area dataviews (activate via upsertDataviewInstance) or ocean area reference layers (find in OCEAN_AREAS_DATAVIEWS list), then orchestrates viewport animation to bounds or coordinates. Falls back gracefully if dataviews are unavailable.

## Related

- uses [[dataview-state-management]] — Activates dataview instances when search results are selected
- implements [[map-controls-system]] — Provides the MapSearch component that activates search results
- uses [[map-viewport-management]] — Triggers fitBounds or setMapViewState to pan/zoom to search results

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
