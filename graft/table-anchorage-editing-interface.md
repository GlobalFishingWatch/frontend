---
name: Table-Anchorage Editing Interface
slug: table-anchorage-editing-interface
type: system
sources:
  - path: >-
      apps/port-labeler/src/features/table-anchorage/components/SubareaSelector.tsx
    hash: cec687817662eb4c764ebcdf999aec52230c84e01364eadb5803cf058b4aa7ef
  - path: apps/port-labeler/src/features/table-anchorage/TableAnchorage.hooks.ts
    hash: 2c8c8881426619d3dc295ccdd60047eaaa6c33538d890d7cd6ac44ecf115ef31
  - path: apps/port-labeler/src/features/table-anchorage/TableAnchorage.tsx
    hash: 0f03ebf847b20df908d32c407d4f75b9f544df23da53e76507ec90e6d80321f6
  - path: apps/port-labeler/src/features/table-anchorage/TableHeader.tsx
    hash: 354e83b03f5907fb28f46a893389addfe71b2f3c588b99baa5c65b8977e6e812
  - path: apps/port-labeler/src/features/table-anchorage/TableRow.tsx
    hash: 7852aeb793ef146defe37be562673ce8dd252e4e2fb9607af92ce3c6f7dddc8c
sources_digest: eb09c366688be71e3373014f576582053beb334b025b1d02d0dd5f70ccbad6b7
links:
  - to: interactive-map-rendering-viewport-state
    relation: uses
    description: >-
      useMapBounds hook filters visible records by geographic bounds; map hover
      state triggers table row highlight via map-context
  - to: port-data-metadata-types
    relation: uses
    description: >-
      TableRow renders SubareaSelector and port-selection inputs that generate
      new subareas/ports with UUIDs and auto-incremented names; displays s2id
      identifier from PortPosition type
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      Dispatches changePointValue, changeSubareaValue, changePortValue via
      useValueManagerConnect; observes selectFilteredPoints, selectCountries,
      selectDisplayExtraData selectors
generator:
  version: 1
covers:
  - symbol: ValueManager
    kind: type
    at: >-
      apps/port-labeler/src/features/table-anchorage/TableAnchorage.hooks.ts:L10-L14
  - symbol: useValueManagerConnect
    kind: function
    at: >-
      apps/port-labeler/src/features/table-anchorage/TableAnchorage.hooks.ts:L15-L44
  - symbol: TableAnchorage
    kind: function
    at: 'apps/port-labeler/src/features/table-anchorage/TableAnchorage.tsx:L26-L179'
  - symbol: orderDirectionType
    kind: type
    at: 'apps/port-labeler/src/features/table-anchorage/TableAnchorage.tsx:L32-L32'
  - symbol: SidebarProps
    kind: type
    at: 'apps/port-labeler/src/features/table-anchorage/TableHeader.tsx:L7-L11'
  - symbol: TableHeader
    kind: function
    at: 'apps/port-labeler/src/features/table-anchorage/TableHeader.tsx:L13-L33'
  - symbol: TableRowProps
    kind: type
    at: 'apps/port-labeler/src/features/table-anchorage/TableRow.tsx:L37-L41'
  - symbol: TableRow
    kind: function
    at: 'apps/port-labeler/src/features/table-anchorage/TableRow.tsx:L43-L226'
  - symbol: SubareaSelectOption
    kind: interface
    at: >-
      apps/port-labeler/src/features/table-anchorage/components/SubareaSelector.tsx:L10-L12
  - symbol: SelectProps
    kind: interface
    at: >-
      apps/port-labeler/src/features/table-anchorage/components/SubareaSelector.tsx:L14-L30
  - symbol: isItemSelected
    kind: function
    at: >-
      apps/port-labeler/src/features/table-anchorage/components/SubareaSelector.tsx:L32-L34
  - symbol: SubareaSelector
    kind: function
    at: >-
      apps/port-labeler/src/features/table-anchorage/components/SubareaSelector.tsx:L36-L165
---

<!-- context:generated:start -->

## Summary

Virtualized, filterable table displaying anchorage and port data within map viewport bounds. TableAnchorage component filters via pointInScreen, renders editable rows with SubareaSelector and InputText fields for port/subarea/label values, and supports sorting and country reassignment. Uses react-window for virtualization and integrates with Redux for state dispatch and internationalization via i18n-labels.

## Related

- uses [[interactive-map-rendering-viewport-state]] — useMapBounds hook filters visible records by geographic bounds; map hover state triggers table row highlight via map-context
- uses [[port-data-metadata-types]] — TableRow renders SubareaSelector and port-selection inputs that generate new subareas/ports with UUIDs and auto-incremented names; displays s2id identifier from PortPosition type
- uses [[redux-state-management-for-labeler]] — Dispatches changePointValue, changeSubareaValue, changePortValue via useValueManagerConnect; observes selectFilteredPoints, selectCountries, selectDisplayExtraData selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
