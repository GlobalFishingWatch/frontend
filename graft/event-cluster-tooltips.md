---
name: Event Cluster Tooltips
slug: event-cluster-tooltips
type: system
sources:
  - path: apps/platform/features/_map/map/popups/events/EventsClusterTooltipRow.tsx
    hash: b747c41b5c3d9550784239e8700d153981822eb0f68ba628e6973324732f1a78
  - path: >-
      apps/platform/features/_map/map/popups/events/EventsClusterTooltipSection.tsx
    hash: 54365a9d163ab8dd6c8a07ea3a0cc26b7e52d8038088ec42f33eb0eb0537ec14
  - path: >-
      apps/platform/features/_map/map/popups/events/EventsEncounterTooltipRow.tsx
    hash: 888eec5717ece75cc52e60111c8d408d3ffe20a3e1c24976d89864ebe0f4bedc
  - path: apps/platform/features/_map/map/popups/events/EventsGapTooltipRow.tsx
    hash: ac88a1b4a20057e8c7de77fb05c34dc38662ea734d3cb3f8292ee30a7cd675ea
  - path: >-
      apps/platform/features/_map/map/popups/events/EventsGenericClusterTooltipRow.tsx
    hash: d9b7b5908da38759468f539ea8d025be04e47c4d8b8ecb3453a905037a3d9e9f
  - path: >-
      apps/platform/features/_map/map/popups/events/EventsPortVisitTooltipRow.tsx
    hash: f643d6972ca61e95ceb4596cdd6b405dd309909e8d38dc51aa184be06c81453c
  - path: apps/platform/features/_map/map/popups/events/PopupByEventType.tsx
    hash: e4cc385f8d67ef66223703c613f9f51e468a460f52c0aa8a8902a905fb847aad
sources_digest: 362f698b9157ac22a7745e7b63773db19c48e538c93e4ab59ba23d37a23ab7d8
links:
  - to: event-type-dispatch
    relation: implements
    description: >-
      PopupByEventType routes features to event-type-specific components via
      layerId and DataviewType matching
  - to: popup-layout-components
    relation: uses
    description: >-
      All event tooltip components use PopupSectionLayout as wrapper for
      consistent styling
  - to: vessel-rendering-components
    relation: uses
    description: >-
      Event tooltip rows use VesselLink, VesselPin, and VesselsTable for vessel
      identification and navigation
generator:
  version: 1
covers:
  - symbol: EventsClusterTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsClusterTooltipRow.tsx:L30-L35
  - symbol: EventsClusterTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsClusterTooltipRow.tsx:L37-L130
  - symbol: EventsClusterTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsClusterTooltipSection.tsx:L15-L20
  - symbol: EventsClusterTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsClusterTooltipSection.tsx:L22-L75
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
  - symbol: EventsGapTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGapTooltipRow.tsx:L32-L37
  - symbol: EventsGapTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGapTooltipRow.tsx:L39-L214
  - symbol: EventsGenericClusterTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGenericClusterTooltipRow.tsx:L10-L15
  - symbol: EventsGenericClusterTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsGenericClusterTooltipRow.tsx:L17-L66
  - symbol: EventsPortVisitTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/events/EventsPortVisitTooltipRow.tsx:L33-L38
  - symbol: EventsPortVisitTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/EventsPortVisitTooltipRow.tsx:L40-L140
  - symbol: PopupByEventTypeProps
    kind: type
    at: 'apps/platform/features/_map/map/popups/events/PopupByEventType.tsx:L24-L29'
  - symbol: PopupByEventType
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/events/PopupByEventType.tsx:L41-L101
---

<!-- context:generated:start -->

## Summary

A specialized subsystem for rendering map popups on clustered event features (encounters, port visits, gaps, loitering). Each event type has a dedicated tooltip row component that conditionally renders summaries (event counts, date ranges) or detailed views (vessel information, timestamps, navigation links) based on the showFeaturesDetails flag, with loading and error state handling.

## Related

- implements [[event-type-dispatch]] — PopupByEventType routes features to event-type-specific components via layerId and DataviewType matching
- uses [[popup-layout-components]] — All event tooltip components use PopupSectionLayout as wrapper for consistent styling
- uses [[vessel-rendering-components]] — Event tooltip rows use VesselLink, VesselPin, and VesselsTable for vessel identification and navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
