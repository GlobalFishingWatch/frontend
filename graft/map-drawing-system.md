---
name: Map Drawing System
slug: map-drawing-system
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx
    hash: afd856a337d94a7a987af883a2fec8080eb8570120b5009501993f4c960beba3
  - path: apps/platform/features/_map/map/map-draw.hooks.ts
    hash: be330ea27509d74ed52fdcf089bc61b928353ff23243a328461d08ecadf81687
sources_digest: e5d248e52918e8fe246de094170e3707827252ca4424b86766309085ee8ec607
links:
  - to: map-layers
    relation: produces
    description: Drawing produces new GeoJSON geometries that become user dataset layers
  - to: map-rendering-core
    relation: configures
    description: >-
      Allows users to draw new geometries on the map, storing results to user
      datasets
generator:
  version: 1
covers:
  - symbol: LayerLibraryUserPanel
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx:L41-L295
  - symbol: SectionComponent
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx:L115-L246
  - symbol: useMapDrawConnect
    kind: function
    at: 'apps/platform/features/_map/map/map-draw.hooks.ts:L9-L48'
---

<!-- context:generated:start -->

## Summary

URL-driven drawing state management for map geometry creation and editing (polygons, points, lines). Drawing mode is toggled and targeted to datasets via query parameters rather than Redux actions, allowing the URL to be the source of truth for drawing state and enabling URL-based undo/recovery.

## Related

- produces [[map-layers]] — Drawing produces new GeoJSON geometries that become user dataset layers
- configures [[map-rendering-core]] — Allows users to draw new geometries on the map, storing results to user datasets

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
