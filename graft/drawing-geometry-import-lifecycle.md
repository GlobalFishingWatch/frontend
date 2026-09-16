---
name: Drawing Geometry Import Lifecycle
slug: drawing-geometry-import-lifecycle
type: concept
sources:
  - path: apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts
    hash: e4f715ba280b91765ea998d36f8bc38308b663a4e44b1119702c7c2ea04839d4
  - path: apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx
    hash: 60ac15257113d63b1ca390dcd0f1e6102c13e4db8f4b8bfcc5b1eefd42c32960
sources_digest: 6a573dd87f0097885bb3446e75c425ad02247d560be5b4a7cc85dc8f383d1027
links:
  - to: drawing-coordinate-system
    relation: implements
    description: Pending-draw lifecycle is core to seamless drawing UX
generator:
  version: 1
covers:
  - symbol: DrawFeature
    kind: type
    at: 'apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx:L39-L39'
  - symbol: MapDraw
    kind: function
    at: 'apps/platform/features/_map/map/overlays/draw/DrawDialog.tsx:L42-L312'
  - symbol: PendingDrawGeometry
    kind: type
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L22-L22
  - symbol: usePendingDrawDataview
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L32-L42
  - symbol: usePendingDrawImportCenter
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L44-L56
  - symbol: usePendingDrawOverlayLayer
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/draw/draw-pending.hooks.ts:L58-L102
---

<!-- context:generated:start -->

## Summary

When user saves drawn geometries, pending geometry persists to pendingDrawGeometryAtom during backend ingestion, rendering as non-interactive dashed preview via usePendingDrawOverlayLayer. Import status polled every 5 seconds via useAutoRefreshImportingDataset. Critical invariant: pending geometry must NOT clear when dataview loads asynchronously (which happens after import completes), otherwise drawn feature disappears during transition. Atom auto-clears when dataset status='done'. Design prevents race conditions by keeping pending geometry visible through entire import→load cycle.

## Related

- implements [[drawing-coordinate-system]] — Pending-draw lifecycle is core to seamless drawing UX

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
