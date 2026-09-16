---
name: Port Labeler Map System
slug: port-labeler-map-system
type: system
sources:
  - path: apps/port-labeler/src/features/map/controls/map-controls.hooks.ts
    hash: 44d256aedf21d0daa14fd435c664eda17480a42307a713327d44018f997d67e3
  - path: apps/port-labeler/src/features/map/controls/MapControls.tsx
    hash: 3637ebde840e9911dd31176e7ea235f9eb9072274acff28b771ba5ec4e23f743
  - path: apps/port-labeler/src/features/map/map-context.hooks.ts
    hash: fb0385df540aa596eef79a56b790d29f9eaf32aa26a6ac2c3ba0e684bd86a732
  - path: apps/port-labeler/src/features/map/map-style.ts
    hash: 18e4ffe7d6c36bdea5cea43a3f9c2732b03516d122c1ac92294d1c4dc5f28408
  - path: apps/port-labeler/src/features/map/map-viewport.hooks.ts
    hash: a9a3d08174338efd14cb8551c7c656bc29dfa1ee79a019d8b364575dcca7049d
  - path: apps/port-labeler/src/features/map/map.hooks.ts
    hash: 81baffa51a14628599854bf98acbb683dbbb6fa7adf60fb832d78c7f7f3ed370
  - path: apps/port-labeler/src/features/map/map.selectors.ts
    hash: 7f69eaceff6bda219fc2e3cc751dd232820f73bcfe9db59cf4360723a3f62b06
sources_digest: 5376993af43cee02fb71db313bd4a3c4038aed3ae41f25029317a24b63d2d764
links:
  - to: geojson-feature-generation
    relation: uses
    description: >-
      map.selectors generates port points, areas, and subarea polygon features
      from labeler state
  - to: labeler-state-management
    relation: depends_on
    description: >-
      Map hooks dispatch setSelectedPoints, setHoverPoint actions and consume
      labeler selectors for point/subarea data
  - to: viewport-state-atom
    relation: uses
    description: >-
      useViewport hook manages map coordinates and zoom via Jotai atoms, with
      URL parameter persistence
generator:
  version: 1
covers:
  - symbol: MapControls
    kind: function
    at: 'apps/port-labeler/src/features/map/controls/MapControls.tsx:L14-L70'
  - symbol: useMapBounds
    kind: function
    at: 'apps/port-labeler/src/features/map/controls/map-controls.hooks.ts:L8-L27'
  - symbol: useMapInstance
    kind: function
    at: 'apps/port-labeler/src/features/map/map-context.hooks.ts:L4-L7'
  - symbol: ViewportKeys
    kind: type
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L8-L8'
  - symbol: ViewportProps
    kind: type
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L9-L9'
  - symbol: UseViewport
    kind: type
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L10-L14'
  - symbol: getUrlViewstateNumericParam
    kind: function
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L16-L20'
  - symbol: useViewport
    kind: function
    at: 'apps/port-labeler/src/features/map/map-viewport.hooks.ts:L28-L43'
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

Complete map interface for port-labeler combining MapLibre GL rendering, interactive controls (zoom, coordinate display, bounds inspection), viewport state management via Jotai atoms, and selection/hover interaction via shift-click box selection and feature state styling. Bridges React state management with map instance API.

## Related

- uses [[geojson-feature-generation]] — map.selectors generates port points, areas, and subarea polygon features from labeler state
- depends on [[labeler-state-management]] — Map hooks dispatch setSelectedPoints, setHoverPoint actions and consume labeler selectors for point/subarea data
- uses [[viewport-state-atom]] — useViewport hook manages map coordinates and zoom via Jotai atoms, with URL parameter persistence

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
