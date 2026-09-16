---
name: Drawn Feature GeoJSON Serialization
slug: drawn-feature-geojson-serialization
type: concept
sources:
  - path: apps/platform/features/_map/map/overlays/draw/draw.utils.ts
    hash: 9e0df2a20b44e2fbec3e1d3f745df98c12a061887b8fc6690ff847620cc77b8d
sources_digest: 1cf642a2e1ba83117ea251311346f149cfe0c5b99b35782f926c0c7ab00f15bb
links:
  - to: drawing-coordinate-system
    relation: implements
    description: >-
      Serialization strategy enables seamless dataset creation from drawn
      features
generator:
  version: 1
covers:
  - symbol: getDrawDatasetDefinition
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/draw.utils.ts:L16-L37'
  - symbol: getFileWithFeatures
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/draw.utils.ts:L39-L63'
---

<!-- context:generated:start -->

## Summary

User-drawn geometries serialized to File blob containing FeatureCollection with each Feature assigned unique sequential gfw_id and draw_id properties (auto-incrementing from max existing ID or starting at 1). Dual-property approach ensures compatibility with downstream API and deck-layers configuration. getDrawDatasetDefinition creates partial Dataset metadata with geometry type, GEOJSON format, and value property set to draw_id. Critical invariant: gfw_id and draw_id must match and increment monotonically; merged geometries require ID collision detection to prevent duplicates.

## Related

- implements [[drawing-coordinate-system]] — Serialization strategy enables seamless dataset creation from drawn features

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
