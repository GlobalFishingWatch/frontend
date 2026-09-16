---
name: Map Interaction Hooks
slug: map-interaction-hooks
type: system
sources:
  - path: apps/platform/features/_map/map/popups/MapPopups.tsx
    hash: 79f076210b688b7a4f5e7dba514a6ea7298f00673310e4443e7e017aa4c34f15
  - path: apps/platform/features/_map/map/popups/PopupWrapper.tsx
    hash: b034d77300909c0d0bff1a9ca9c149a96feda23fbbcc2d4e40f9c463701e003d
  - path: >-
      apps/platform/features/_map/map/popups/shared/VesselDetectionTimestamps.tsx
    hash: 52024e7581e297faef1d3ba31996a413beb09dedb8f0d3c4e78220d4746b3052
  - path: apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx
    hash: 40bb7601a1fc92e94a4421bfcb995ca4871726a8495116e85afd874a17fb6941
  - path: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx
    hash: 9f10238a28fd2bda9248d36f9d295108abe36edd58dfb2e5cb76e03e2c16341a
  - path: apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx
    hash: 8619bd4e73018a937c0eea57c016bdd1142da37df86b26c76bafc1deec63c536
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx
    hash: 8735f9853eef7c021109c8cd2011809b2d8bc4ef9a15e4d71f68eaaa0110ef57
  - path: apps/platform/features/_map/timebar/timebar-interactions.hooks.ts
    hash: c486bc5b4f00c8076abdb7bdbc872c18f201aa7ac8d3037ae23134c91486ee58
sources_digest: 5050359001fbaba48589ea6112dfd43128264f45e0a4ab0cfd63e90660f1e0d1
links:
  - to: map-popup-system
    relation: uses
    description: >-
      Popup components call useContextInteractions.onReportClick,
      useMapFitBounds, useTimerangeConnect to respond to user clicks on features
  - to: map-popups-system
    relation: part_of
    description: Interaction hooks are essential to popup state management
  - to: time-mode-real-time-state
    relation: uses
    description: >-
      Hooks update global time range via Redux/Jotai and coordinate viewport
      adjustments with temporal bounds
  - to: timebar-interaction-hooks
    relation: part_of
    description: >-
      useTimebarMouseInteractions and useOnTimebarRangeChange handle time-range
      changes and event navigation from the timebar
generator:
  version: 1
covers:
  - symbol: MapPopups
    kind: function
    at: 'apps/platform/features/_map/map/popups/MapPopups.tsx:L19-L75'
  - symbol: getBoundary
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L26-L26'
  - symbol: OFF_MAP_RECT
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L27-L27'
  - symbol: PopupWrapperProps
    kind: type
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L29-L38'
  - symbol: PopupWrapper
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L40-L142'
  - symbol: apply
    kind: method
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L90-L92'
  - symbol: VesselDetectionTimestamps
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/shared/VesselDetectionTimestamps.tsx:L15-L62
  - symbol: RulerTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx:L13-L16
  - symbol: RulerTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx:L18-L48
  - symbol: onDeleteClick
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx:L29-L34
  - symbol: WorkspacePointsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx:L18-L21
  - symbol: WorkspacePointsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx:L23-L92
  - symbol: WorkspaceLabel
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx:L40-L51
  - symbol: UserTracksTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx:L15-L18
  - symbol: UserTracksTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx:L20-L58
  - symbol: VesselTracksTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L44-L47
  - symbol: VesselTracksTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L49-L187
  - symbol: VesselTracksTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L189-L235
  - symbol: useTimebarBookmark
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-interactions.hooks.ts:L39-L60'
  - symbol: useOnTimebarRangeChange
    kind: function
    at: 'apps/platform/features/_map/timebar/timebar-interactions.hooks.ts:L62-L99'
  - symbol: useTimebarMouseInteractions
    kind: function
    at: >-
      apps/platform/features/_map/timebar/timebar-interactions.hooks.ts:L101-L208
---

<!-- context:generated:start -->

## Summary

Custom React hooks that coordinate map interaction state across popups and other map features. useClickedEventConnect dispatches Redux actions to update clicked event state, useMapHoverInteraction provides hover configuration and callbacks for deck-layer-composer, useSetMapCoordinates and useTimerangeConnect dispatch viewport and timerange state updates, and useRulers provides ruler state management. These hooks encapsulate Redux dispatch patterns and provide memoized callbacks to prevent unnecessary re-renders.

## Related

- uses [[map-popup-system]] — Popup components call useContextInteractions.onReportClick, useMapFitBounds, useTimerangeConnect to respond to user clicks on features
- part of [[map-popups-system]] — Interaction hooks are essential to popup state management
- uses [[time-mode-real-time-state]] — Hooks update global time range via Redux/Jotai and coordinate viewport adjustments with temporal bounds
- part of [[timebar-interaction-hooks]] — useTimebarMouseInteractions and useOnTimebarRangeChange handle time-range changes and event navigation from the timebar

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
