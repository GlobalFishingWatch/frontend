---
name: Ruler Drawing Tool
slug: ruler-drawing-tool
type: system
sources:
  - path: apps/track-labeler/src/features/rulers/rulers.selectors.ts
    hash: 50f83f083e3f8d9200cc5d0d107cf7096e899a96350b5bc372e0ee4a8dddffa9
  - path: apps/track-labeler/src/features/rulers/rulers.slice.ts
    hash: 9058d2d2832b9eba8934689f9e42dac339ec6419f740300478dc91ff28b3410f
  - path: apps/track-labeler/src/features/rulers/Rulers.tsx
    hash: 167d1992d286178d9e0492a131a5a2c3a246fedff47e5180cef48ce2f5c1e38f
sources_digest: 5e617902c2e57fbe15f9577a684860020cb3c783c6a1ab2bf9943165a5cb6358
links:
  - to: map-rendering-visualization-layer
    relation: uses
    description: >-
      Map useMapClick hook calls editRuler/moveCurrentRuler when in ruler
      editing mode; map instance stored for interaction.
generator:
  version: 1
covers:
  - symbol: Rulers
    kind: function
    at: 'apps/track-labeler/src/features/rulers/Rulers.tsx:L15-L51'
  - symbol: selectEditing
    kind: function
    at: 'apps/track-labeler/src/features/rulers/rulers.selectors.ts:L3-L3'
  - symbol: selectNumRulers
    kind: function
    at: 'apps/track-labeler/src/features/rulers/rulers.selectors.ts:L4-L4'
  - symbol: selectRulers
    kind: function
    at: 'apps/track-labeler/src/features/rulers/rulers.selectors.ts:L5-L5'
  - symbol: Ruler
    kind: type
    at: 'apps/track-labeler/src/features/rulers/rulers.slice.ts:L4-L15'
  - symbol: RulersSlice
    kind: type
    at: 'apps/track-labeler/src/features/rulers/rulers.slice.ts:L17-L22'
---

<!-- context:generated:start -->

## Summary

Implements a two-click ruler measurement interaction on the map. The rulers.slice Redux reducer manages ruler state (array of start/end coordinates, editing/drawing flags). The Rulers component provides UI controls (toggle edit, delete all) with a count badge. Map click handlers (useMapClick) integrate ruler creation/editing by calling editRuler and moveCurrentRuler actions. Ruler endpoints are offset by 0.000001 degrees during drawing to avoid degenerate zero-length shapes.

## Related

- uses [[map-rendering-visualization-layer]] — Map useMapClick hook calls editRuler/moveCurrentRuler when in ruler editing mode; map instance stored for interaction.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
