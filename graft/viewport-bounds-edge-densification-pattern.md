---
name: Viewport Bounds Edge Densification Pattern
slug: viewport-bounds-edge-densification-pattern
type: concept
sources:
  - path: libs/ui-components/src/miniglobe/Miniglobe.tsx
    hash: 0f9816ecb2246a086b20ef87ffed059a19a2bea826328949f4680448fd52941b
sources_digest: b0836fbbfcfb20416472768bb05afcae011db0a8e8f24442d865bb50b0f2f1af
links:
  - to: map-globe-visualization
    relation: implements
    description: >-
      Miniglobe uses edge densification to correctly render viewport bounds
      under orthographic projection
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

Miniglobe component handles orthographic projection distortion at the edges of the sphere by interpolating rectangular bounds edges with densifyEdge function (EDGE_STEPS=10 intermediate points). The component switches rendering strategy based on geographic extent: displays a small circle (< MIN_DEGREES_PATH threshold) when zoomed into a very small area, a full polygon path (> MAX_DEGREES_PATH threshold) for larger extents. This graceful degradation prevents rendering artifacts (e.g., broken polygons at extreme zoom levels) and maintains visual clarity across the full zoom range. Edge densification is essential because orthographic projection curves straight edges into arcs, which naive SVG path rendering would misrepresent.

## Related

- implements [[map-globe-visualization]] — Miniglobe uses edge densification to correctly render viewport bounds under orthographic projection

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
