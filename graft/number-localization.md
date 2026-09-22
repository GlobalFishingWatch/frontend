---
name: Number Localization
slug: number-localization
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx
    hash: bf2a3df480d75a08aa247c4fb238389c6d377ff66c0c341eaae110bc612bab4d
  - path: >-
      apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx
    hash: 36be4acb15d6b7e71734b91a5dd32f07f824d6b16267d57d0bfdf4ffb60aec77
  - path: apps/platform/features/_map/map/popups/events/EventsClusterTooltipRow.tsx
    hash: b747c41b5c3d9550784239e8700d153981822eb0f68ba628e6973324732f1a78
  - path: >-
      apps/platform/features/_map/map/popups/events/EventsGenericClusterTooltipRow.tsx
    hash: d9b7b5908da38759468f539ea8d025be04e47c4d8b8ecb3453a905037a3d9e9f
  - path: >-
      apps/platform/features/_map/map/popups/shared/VesselDetectionTimestamps.tsx
    hash: 52024e7581e297faef1d3ba31996a413beb09dedb8f0d3c4e78220d4746b3052
  - path: apps/platform/features/_map/map/popups/tools/HotspotTooltipSection.tsx
    hash: 0a04a761b3bca755dffb8bb7fe5cbd7de5ff42c6c35ae0ab6bc19b4511ed06d6
sources_digest: 41c366cb70dc120f4def29fec093b014569d34d51dc8aa485afd8081d80843ac
links:
  - to: map-popups-system
    relation: part_of
    description: Localization is applied throughout the popup system for user-facing text
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
  - symbol: EventsGenericClusterTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGenericClusterTooltipRow.tsx:L10-L15
  - symbol: EventsGenericClusterTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGenericClusterTooltipRow.tsx:L17-L66
  - symbol: VesselDetectionTimestamps
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/shared/VesselDetectionTimestamps.tsx:L15-L62
  - symbol: HotspotTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/tools/HotspotTooltipSection.tsx:L10-L12
  - symbol: HotspotTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/HotspotTooltipSection.tsx:L14-L31
---

<!-- context:generated:start -->

## Summary

A pattern for locale-aware numeric display using i18n-aware components (I18nNumber, I18nDate) and d3-format utilities. Most tooltip components use I18nNumber to format counts, hours, and percentages with proper thousand separators and decimal precision according to user locale. This pattern is implemented throughout the popup system for consistency.

## Related

- part of [[map-popups-system]] — Localization is applied throughout the popup system for user-facing text

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
