---
name: Conditional Detail Rendering
slug: conditional-detail-rendering
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx
    hash: bf2a3df480d75a08aa247c4fb238389c6d377ff66c0c341eaae110bc612bab4d
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
  - path: apps/platform/features/_map/map/popups/events/EventsGapTooltipRow.tsx
    hash: ac88a1b4a20057e8c7de77fb05c34dc38662ea734d3cb3f8292ee30a7cd675ea
  - path: >-
      apps/platform/features/_map/map/popups/events/EventsPortVisitTooltipRow.tsx
    hash: f643d6972ca61e95ceb4596cdd6b405dd309909e8d38dc51aa184be06c81453c
sources_digest: 843744326d3bf0b4362736def5252dde70d61c7bfc2a419f1729ca22c3c39fca
links:
  - to: context-layer-tooltips
    relation: part_of
    description: Conditional rendering is extensively used in context layer tooltips
  - to: environmental-data-tooltips
    relation: part_of
    description: >-
      Environmental tooltips conditionally display details based on
      showFeaturesDetails
  - to: event-cluster-tooltips
    relation: part_of
    description: Event tooltip rows implement conditional detail rendering
generator:
  version: 1
covers:
  - symbol: ContextTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L24-L41
  - symbol: ContextTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L43-L187
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
  - symbol: EventsGapTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGapTooltipRow.tsx:L32-L37
  - symbol: EventsGapTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGapTooltipRow.tsx:L39-L214
  - symbol: EventsPortVisitTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsPortVisitTooltipRow.tsx:L33-L38
  - symbol: EventsPortVisitTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsPortVisitTooltipRow.tsx:L40-L140
---

<!-- context:generated:start -->

## Summary

A widespread UI pattern across tooltip row components where showFeaturesDetails flag controls rendering of full details vs. summary views. Summary mode shows aggregated counts/dates, while detail mode reveals vessel names, timestamps, navigation links, and action buttons. This dual-mode rendering is implemented by nearly all event, environment, and context tooltip components to provide flexible popup behavior depending on interaction context.

## Related

- part of [[context-layer-tooltips]] — Conditional rendering is extensively used in context layer tooltips
- part of [[environmental-data-tooltips]] — Environmental tooltips conditionally display details based on showFeaturesDetails
- part of [[event-cluster-tooltips]] — Event tooltip rows implement conditional detail rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
