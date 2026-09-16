---
name: Track Correction Workflow
slug: track-correction-workflow
type: concept
sources:
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx
    hash: 8735f9853eef7c021109c8cd2011809b2d8bc4ef9a15e4d71f68eaaa0110ef57
sources_digest: 22a77835e62a49c5b734de8b323aa27b2ae8b0314b3a6933671f00911e1294f7
links:
  - to: dataviews-datasets-state
    relation: depends_on
    description: >-
      Track correction workflow reads Redux state to determine workspace type
      (selectIsTurningTidesWorkspace) and permission levels
  - to: map-popup-system
    relation: uses
    description: >-
      VesselTracksTooltipSection conditionally renders 'Log An Issue' button;
      clicking triggers track-correction module for issue submission
  - to: sidebar-container-layout
    relation: implements
    description: >-
      Sidebar lazy-loads TrackCorrection component and manages overlay
      visibility controlled by selectTrackCorrectionOpen
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

A specialized workflow for users to report inaccuracies in vessel track data via a 'Log An Issue' button in track tooltips. It integrates authentication, workspace context (Turning Tides), and timerange reduction logic to submit issues with temporal and spatial bounds.

## Related

- depends on [[dataviews-datasets-state]] — Track correction workflow reads Redux state to determine workspace type (selectIsTurningTidesWorkspace) and permission levels
- uses [[map-popup-system]] — VesselTracksTooltipSection conditionally renders 'Log An Issue' button; clicking triggers track-correction module for issue submission
- implements [[sidebar-container-layout]] — Sidebar lazy-loads TrackCorrection component and manages overlay visibility controlled by selectTrackCorrectionOpen

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
