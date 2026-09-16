---
name: Port Data & Metadata Types
slug: port-data-metadata-types
type: concept
sources:
  - path: apps/port-labeler/src/features/labeler/labeler.slice.ts
    hash: 6d9e7f372edc1bc65d952050a446eddd4f623b551a33c6bb7588a4c287a64251
  - path: apps/port-labeler/src/features/map/Map.tsx
    hash: 1f1325ea9db28777c40c01ca2c0ef8750ec5005e930ac30f2cd74e20d4f3b277
  - path: apps/port-labeler/src/types/index.ts
    hash: 2b43c0da066ba8c03c6e6cc6d0c87e7662a3b6f7ca6288ac957c05895a3731bd
sources_digest: 554b3d87b8cdac7dd3af867fa21960e8d34233a3b2dd2b516568341ceff23484
links:
  - to: interactive-map-rendering-viewport-state
    relation: implements
    description: >-
      Map renders GeoJSON features conforming to PortPositionFeature and
      PortAreaFeature contracts
  - to: redux-state-management-for-labeler
    relation: implements
    description: >-
      Labeler slice normalizes and persists PortPosition and PortSubarea
      records; import/export workflows serialize to/from these types
  - to: table-anchorage-editing-interface
    relation: implements
    description: >-
      Table rows display and edit PortPosition data; SubareaSelector manages
      PortSubarea instances
generator:
  version: 1
covers:
  - symbol: ValuesObject
    kind: interface
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L8-L10'
  - symbol: CountryMap
    kind: interface
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L11-L13'
  - symbol: CountrySelectMap
    kind: interface
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L14-L16'
  - symbol: ProjectSlice
    kind: type
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L18-L31'
  - symbol: selectDisplayExtraData
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L236-L236'
  - symbol: selectSelectedPoints
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L237-L237'
  - symbol: selectCountry
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L238-L238'
  - symbol: selectHoverPoint
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L239-L239'
  - symbol: selectSubareas
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L240-L240'
  - symbol: selectPorts
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L241-L241'
  - symbol: selectMapData
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L242-L242'
  - symbol: selectPortValues
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L243-L243'
  - symbol: selectSubareaValues
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L244-L244'
  - symbol: selectPointValues
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L245-L245'
  - symbol: selectCountries
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L246-L246'
  - symbol: selectCountryColors
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L247-L247'
  - symbol: transformRequest
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L25-L36'
  - symbol: handleError
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L38-L42'
  - symbol: MapWrapper
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L44-L104'
  - symbol: Locale
    kind: enum
    at: 'apps/port-labeler/src/types/index.ts:L1-L3'
  - symbol: WorkspaceParam
    kind: type
    at: 'apps/port-labeler/src/types/index.ts:L5-L6'
  - symbol: QueryParams
    kind: type
    at: 'apps/port-labeler/src/types/index.ts:L8-L10'
  - symbol: MapCoordinates
    kind: type
    at: 'apps/port-labeler/src/types/index.ts:L12-L17'
  - symbol: PortPositionFeature
    kind: type
    at: 'apps/port-labeler/src/types/index.ts:L19-L30'
  - symbol: PortAreaFeature
    kind: type
    at: 'apps/port-labeler/src/types/index.ts:L32-L38'
  - symbol: PortPositionsGeneratorConfig
    kind: interface
    at: 'apps/port-labeler/src/types/index.ts:L40-L46'
  - symbol: AreaGeneratorConfig
    kind: interface
    at: 'apps/port-labeler/src/types/index.ts:L48-L54'
  - symbol: PortSubarea
    kind: interface
    at: 'apps/port-labeler/src/types/index.ts:L56-L60'
  - symbol: PortPosition
    kind: interface
    at: 'apps/port-labeler/src/types/index.ts:L62-L74'
---

<!-- context:generated:start -->

## Summary

Foundational type system defining PortPosition (S2-indexed port data with coordinates, destination rankings, shore distance), PortSubarea (administrative subdivisions with optional colors), GeoJSON feature types (PortPositionFeature, PortAreaFeature), and generator configs for map layer creation. These contracts underpin all data loading, state persistence, map rendering, and labeling workflows.

## Related

- implements [[interactive-map-rendering-viewport-state]] — Map renders GeoJSON features conforming to PortPositionFeature and PortAreaFeature contracts
- implements [[redux-state-management-for-labeler]] — Labeler slice normalizes and persists PortPosition and PortSubarea records; import/export workflows serialize to/from these types
- implements [[table-anchorage-editing-interface]] — Table rows display and edit PortPosition data; SubareaSelector manages PortSubarea instances

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
