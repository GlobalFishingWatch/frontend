---
name: Interactive Selection & Table Synchronization
slug: interactive-selection-table-synchronization
type: concept
sources:
  - path: apps/port-labeler/src/features/map/map.hooks.ts
    hash: 81baffa51a14628599854bf98acbb683dbbb6fa7adf60fb832d78c7f7f3ed370
  - path: apps/port-labeler/src/features/map/Map.tsx
    hash: 1f1325ea9db28777c40c01ca2c0ef8750ec5005e930ac30f2cd74e20d4f3b277
  - path: apps/port-labeler/src/features/table-anchorage/TableAnchorage.tsx
    hash: 0f03ebf847b20df908d32c407d4f75b9f544df23da53e76507ec90e6d80321f6
  - path: apps/port-labeler/src/features/table-anchorage/TableRow.tsx
    hash: 7852aeb793ef146defe37be562673ce8dd252e4e2fb9607af92ce3c6f7dddc8c
sources_digest: 724807a26aa0b61bd507006cb5d61a91dee939f08fe13530337e46658742ef85
links:
  - to: interactive-map-rendering-viewport-state
    relation: depends_on
    description: >-
      Selection box overlay uses CSS transforms for positioning; requires map
      viewport state from useViewport hook
  - to: table-anchorage-editing-interface
    relation: depends_on
    description: >-
      useMapBounds filters visible records; TableRow onRowHover syncs to map
      feature state for visual highlighting
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
  - symbol: TableAnchorage
    kind: function
    at: 'apps/port-labeler/src/features/table-anchorage/TableAnchorage.tsx:L26-L179'
  - symbol: orderDirectionType
    kind: type
    at: 'apps/port-labeler/src/features/table-anchorage/TableAnchorage.tsx:L32-L32'
  - symbol: TableRowProps
    kind: type
    at: 'apps/port-labeler/src/features/table-anchorage/TableRow.tsx:L37-L41'
  - symbol: TableRow
    kind: function
    at: 'apps/port-labeler/src/features/table-anchorage/TableRow.tsx:L43-L226'
---

<!-- context:generated:start -->

## Summary

Map selection box overlay and useMapBounds hook filter table rows to only show records within current viewport, preventing out-of-bounds editing. Click detection triggers row selection; map hover state syncs with table row highlighting via Redux and map-context hooks. This two-way binding ensures map and table stay synchronized during interactive labeling workflows.

## Related

- depends on [[interactive-map-rendering-viewport-state]] — Selection box overlay uses CSS transforms for positioning; requires map viewport state from useViewport hook
- depends on [[table-anchorage-editing-interface]] — useMapBounds filters visible records; TableRow onRowHover syncs to map feature state for visual highlighting

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
