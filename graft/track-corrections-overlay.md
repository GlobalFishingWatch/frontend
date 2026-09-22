---
name: Track Corrections Overlay
slug: track-corrections-overlay
type: system
sources:
  - path: >-
      apps/platform/features/_map/map/overlays/track-corrections/TrackCorrectionsOverlay.tsx
    hash: 0759ab7c9d58a358155dfff6d4f8cda8326f62296fbcd4bd33eecf91ecb80658
sources_digest: d1780ee3d5f2488808d600900ab7c05b56b04a5f896c6c089e690c6fa33984fb
links:
  - to: highlight-synchronization
    relation: depends_on
    description: >-
      Track-correction highlighting system overrides timebar highlighting based
      on active correction ID
  - to: overlay-ui-state-management
    relation: uses
    description: Uses overlaysCursorAtom for cursor feedback
generator:
  version: 1
covers:
  - symbol: TrackCorrectionOverlayIssue
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/track-corrections/TrackCorrectionsOverlay.tsx:L30-L110
  - symbol: TrackCorrectionsOverlay
    kind: function
    at: >-
      apps/platform/features/_map/map/overlays/track-corrections/TrackCorrectionsOverlay.tsx:L112-L144
---

<!-- context:generated:start -->

## Summary

Renders interactive map markers for vessel track correction issues, allowing users to investigate navigation anomalies. On click, orchestrates side effects: pins vessel via usePinVessel, sets active track-correction ID via setTrackCorrectionId, adjusts map viewport via setMapCoordinates, and updates time range via setTimerange to show relevant temporal context. Filters resolved issues, displays confirmation status via icon selection (tick vs. feedback icon), handles hover cursor via overlaysCursorAtom, and lazy-loads vessel dataviews if not already present. Uses nebula.gl HtmlOverlay for positioning.

## Related

- depends on [[highlight-synchronization]] — Track-correction highlighting system overrides timebar highlighting based on active correction ID
- uses [[overlay-ui-state-management]] — Uses overlaysCursorAtom for cursor feedback

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
