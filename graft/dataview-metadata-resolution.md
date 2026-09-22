---
name: Dataview Metadata Resolution
slug: dataview-metadata-resolution
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx
    hash: 00a19460456bfdaf3e5d29dc6fa40dd500036b6a2d1a9aa728193e84d947d3fb
  - path: >-
      apps/platform/features/_map/map/popups/environment/BathymetryContourTooltipSection.tsx
    hash: 7a2c01c3d0ee93158f3c5d14ac2cf269d7f319a068952b0da976addc2e02e14b
  - path: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx
    hash: 36be4acb15d6b7e71734b91a5dd32f07f824d6b16267d57d0bfdf4ffb60aec77
  - path: apps/platform/features/_map/map/popups/events/EventsClusterTooltipRow.tsx
    hash: b747c41b5c3d9550784239e8700d153981822eb0f68ba628e6973324732f1a78
  - path: >-
      apps/platform/features/_map/map/popups/events/EventsEncounterTooltipRow.tsx
    hash: 888eec5717ece75cc52e60111c8d408d3ffe20a3e1c24976d89864ebe0f4bedc
  - path: apps/platform/features/_map/map/popups/PopupByCategory.tsx
    hash: 3d8d6d069712fbc51be6bb299703e55fdd7b376c857b0aaa7063a12b0fb19241
  - path: apps/platform/features/_map/map/popups/shared/VesselsTable.tsx
    hash: b426e05a7d81ec09e71d15931cfecf890bd74d9131cd6c0a8e8e041107327af9
sources_digest: 0e3e1995b52faa1d03959355c7348fc5dfbc582ac1992c60bcd0b7a7e64907bb
links:
  - to: map-popups-system
    relation: part_of
    description: Dataview resolution is fundamental to popup content rendering
generator:
  version: 1
covers:
  - symbol: PopupByCategoryProps
    kind: type
    at: 'apps/platform/features/_map/map/popups/PopupByCategory.tsx:L71-L74'
  - symbol: PopupByCategory
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupByCategory.tsx:L78-L433'
  - symbol: ContextTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx:L19-L22
  - symbol: ContextTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx:L24-L96
  - symbol: BathymetryContourTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/environment/BathymetryContourTooltipSection.tsx:L16-L19
  - symbol: BathymetryContourTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/environment/BathymetryContourTooltipSection.tsx:L21-L58
  - symbol: GriddedValueTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx:L19-L22
  - symbol: parseEnvironmentalValue
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx:L24-L32
  - symbol: GriddedValueTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx:L34-L87
  - symbol: EventsClusterTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsClusterTooltipRow.tsx:L30-L35
  - symbol: EventsClusterTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsClusterTooltipRow.tsx:L37-L130
  - symbol: parseEncounterEvent
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsEncounterTooltipRow.tsx:L29-L43
  - symbol: EventsEncounterTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsEncounterTooltipRow.tsx:L45-L50
  - symbol: EventsEncounterTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsEncounterTooltipRow.tsx:L52-L249
  - symbol: VesselsTable
    kind: function
    at: 'apps/platform/features/_map/map/popups/shared/VesselsTable.tsx:L50-L289'
---

<!-- context:generated:start -->

## Summary

A pervasive pattern where Redux selectors (selectAllDataviewInstancesResolved, selectDataviewInstancesResolved, selectEventsDataviews) fetch dataview instances from state, then utility functions (getDatasetTitleByDataview, getDatasetLabel) derive human-readable titles and metadata. The pattern enables consistent dataset naming across all tooltip components while delegating metadata lookup responsibility to Redux.

## Related

- part of [[map-popups-system]] — Dataview resolution is fundamental to popup content rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
