---
name: Viewport-Based Coordinate Display
slug: viewport-based-coordinate-display
type: concept
sources:
  - path: apps/platform/features/_map/map/controls/MapInfo.tsx
    hash: 8b6b326824ff88605c88aa0011275753bf29b5f77c429e8b4446780f39dcf156
  - path: apps/platform/features/_map/map/controls/MapScaleControl.tsx
    hash: e251f3a09f44534f2e6386afaaf1966987312f1efb006f7a4ae85e8aa5c022af
  - path: apps/platform/features/_map/map/controls/MiniGlobeInfo.tsx
    hash: 7136252372352adf2ae3342c1e6318d8c6a2eaf37980b28d02d68f5b3924bdef
sources_digest: ade9fc246a4c086e3daf75c3f89545ff0a9cdb6557c6e37279b81e9e63896271
links:
  - to: map-controls-system
    relation: implements
    description: 'Renders viewport-adaptive coordinate, scale, and area displays'
generator:
  version: 1
covers:
  - symbol: MapInfo
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapInfo.tsx:L14-L36'
  - symbol: ScaleControlProps
    kind: type
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L12-L14'
  - symbol: getDecimalRoundNum
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L16-L19'
  - symbol: getRoundNum
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L21-L28'
  - symbol: ScaleUnit
    kind: type
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L30-L30'
  - symbol: MapScaleControl
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L37-L71'
  - symbol: toggleMeasurement
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L46-L48'
  - symbol: MiniGlobeInfo
    kind: function
    at: 'apps/platform/features/_map/map/controls/MiniGlobeInfo.tsx:L13-L53'
  - symbol: updateAreaName
    kind: function
    at: 'apps/platform/features/_map/map/controls/MiniGlobeInfo.tsx:L20-L36'
---

<!-- context:generated:start -->

## Summary

Map controls display contextual information (coordinates, scale, ocean area names) based on viewport state. Scale adapts to zoom level via Maplibre GL rounding logic, coordinates format as decimal degrees or DMS, and ocean area names are fetched based on viewport center. All calculations account for map projection properties at current zoom.

## Related

- implements [[map-controls-system]] — Renders viewport-adaptive coordinate, scale, and area displays

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
