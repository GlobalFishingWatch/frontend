---
name: Interactive Map Rendering & Viewport State
slug: interactive-map-rendering-viewport-state
type: system
sources:
  - path: apps/port-labeler/src/features/map/map.hooks.ts
    hash: 81baffa51a14628599854bf98acbb683dbbb6fa7adf60fb832d78c7f7f3ed370
  - path: apps/port-labeler/src/features/map/map.selectors.ts
    hash: 7f69eaceff6bda219fc2e3cc751dd232820f73bcfe9db59cf4360723a3f62b06
  - path: apps/port-labeler/src/features/map/Map.tsx
    hash: 1f1325ea9db28777c40c01ca2c0ef8750ec5005e930ac30f2cd74e20d4f3b277
sources_digest: 4e2c0dfc23f3cb5aaafe2c043c05cfa30dd40408fc2f8a572d77431efe2e5622
links:
  - to: authentication-api-token-management
    relation: depends_on
    description: >-
      transformRequest pattern assumes GFWAPI.token is always available; calls
      GFWAPI.refreshAPIToken() on 401 responses to maintain session validity
  - to: interactive-selection-table-synchronization
    relation: uses
    description: >-
      Map selection box overlay feeds into useMapBounds hook which triggers
      table filtering; click detection and map events drive table row
      highlighting
  - to: port-data-metadata-types
    relation: uses
    description: >-
      MapWrapper renders PortPosition and PortArea feature types as GeoJSON
      layers; selection logic depends on s2id geographic grid system
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      MapWrapper dispatches and observes Redux state for layer visibility,
      selected points, and viewport changes; receives merged layers from
      selectPortPositionLayer and selectAreaLayer selectors
generator:
  version: 1
covers:
  - symbol: transformRequest
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L25-L36'
  - symbol: handleError
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L38-L42'
  - symbol: MapWrapper
    kind: function
    at: 'apps/port-labeler/src/features/map/Map.tsx:L44-L104'
  - symbol: BoxSelection
    kind: interface
    at: 'apps/port-labeler/src/features/map/map.hooks.ts:L20-L25'
  - symbol: UseSelector
    kind: type
    at: 'apps/port-labeler/src/features/map/map.hooks.ts:L27-L37'
  - symbol: useSelectorConnect
    kind: function
    at: 'apps/port-labeler/src/features/map/map.hooks.ts:L40-L201'
  - symbol: UseMap
    kind: type
    at: 'apps/port-labeler/src/features/map/map.hooks.ts:L203-L205'
  - symbol: useMapConnect
    kind: function
    at: 'apps/port-labeler/src/features/map/map.hooks.ts:L207-L243'
---

<!-- context:generated:start -->

## Summary

MapWrapper composes MapLibre GL with Redux-driven layer management, interactive selection tools, and authentication-aware tile requests. Integrates viewport state via useViewport hook, dynamically merges Redux-selected layers (ports, areas), and intercepts tile requests to inject Bearer tokens for Global Fishing Watch API access while refreshing tokens on 401 responses.

## Related

- depends on [[authentication-api-token-management]] — transformRequest pattern assumes GFWAPI.token is always available; calls GFWAPI.refreshAPIToken() on 401 responses to maintain session validity
- uses [[interactive-selection-table-synchronization]] — Map selection box overlay feeds into useMapBounds hook which triggers table filtering; click detection and map events drive table row highlighting
- uses [[port-data-metadata-types]] — MapWrapper renders PortPosition and PortArea feature types as GeoJSON layers; selection logic depends on s2id geographic grid system
- uses [[redux-state-management-for-labeler]] — MapWrapper dispatches and observes Redux state for layer visibility, selected points, and viewport changes; receives merged layers from selectPortPositionLayer and selectAreaLayer selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
