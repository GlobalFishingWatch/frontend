---
name: Map Globe Visualization
slug: map-globe-visualization
type: system
sources:
  - path: libs/ui-components/src/miniglobe/index.ts
    hash: ab49b47420e8bb303c8c9485dd23f35817513c01264ee6ec5510e5fe6481e04d
  - path: libs/ui-components/src/miniglobe/Miniglobe.tsx
    hash: 0f9816ecb2246a086b20ef87ffed059a19a2bea826328949f4680448fd52941b
sources_digest: f3e3ecea2b71e72eeafcb12fd598645f4f7a87bbabc8027d68b745d8e31e5205
links:
  - to: d3-scale-geojson-integration
    relation: depends_on
    description: >-
      Miniglobe uses d3-geo for orthographic projection math and topojson-client
      for Natural Earth topology deserialization
  - to: viewport-bounds-edge-densification-pattern
    relation: implements
    description: >-
      Miniglobe interpolates rectangular bounds edges to handle orthographic
      projection distortion at sphere edges; switches between point and polygon
      rendering based on geographic extent
generator:
  version: 1
covers:
  - symbol: MiniglobeBounds
    kind: interface
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L10-L15'
  - symbol: MiniglobeCenter
    kind: interface
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L17-L20'
  - symbol: densifyEdge
    kind: function
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L23-L27'
  - symbol: MiniglobeProps
    kind: interface
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L37-L43'
  - symbol: MiniGlobe
    kind: function
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L45-L136'
---

<!-- context:generated:start -->

## Summary

Miniglobe component rendering an interactive orthographic globe using D3 geographic projections, Natural Earth topology data, and optional viewport bounds visualization. Uses memoized D3 projection and path generation for performance, with edge densification logic to handle orthographic projection distortion.

## Related

- depends on [[d3-scale-geojson-integration]] — Miniglobe uses d3-geo for orthographic projection math and topojson-client for Natural Earth topology deserialization
- implements [[viewport-bounds-edge-densification-pattern]] — Miniglobe interpolates rectangular bounds edges to handle orthographic projection distortion at sphere edges; switches between point and polygon rendering based on geographic extent

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
