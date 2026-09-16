---
name: Map-aware Time Selection
slug: map-aware-time-selection
type: concept
sources:
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx
    hash: 5e3036a25c79dd5641d4ecf6ba6553b6002cfbe83188a017cf3813f6b69427af
  - path: apps/platform/features/_vessels/track-correction/TrackSlider.tsx
    hash: 4032b1ca6cb32c8950dc6f413791111402ae86bec7c06d62d73c02fa79a48ca3
sources_digest: 97f6ef8e35529c3b7125f74b5540ad8a77b5d73684ecda5b4d902532a91947f3
links:
  - to: track-correction-feature
    relation: implements
    description: >-
      TrackSlider component snaps to real GPS points and syncs time range with
      Redux via setTrackCorrectionTimerange
generator:
  version: 1
covers:
  - symbol: TrackCorrectionNew
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx:L42-L303
  - symbol: SegmentsTimelineProps
    kind: type
    at: 'apps/platform/features/_vessels/track-correction/TrackSlider.tsx:L20-L26'
  - symbol: TrackSegmentsTimeline
    kind: function
    at: 'apps/platform/features/_vessels/track-correction/TrackSlider.tsx:L28-L103'
  - symbol: TrackSliderProps
    kind: type
    at: 'apps/platform/features/_vessels/track-correction/TrackSlider.tsx:L105-L111'
  - symbol: TrackSlider
    kind: function
    at: 'apps/platform/features/_vessels/track-correction/TrackSlider.tsx:L113-L235'
---

<!-- context:generated:start -->

## Summary

Dual-thumb time range slider snaps selection to actual GPS point timestamps via findNearestPoint, visualizes track segments on canvas, syncs with Redux state and map layer geometry. Used in track correction reporting and vessel profile event filtering.

## Related

- implements [[track-correction-feature]] — TrackSlider component snaps to real GPS points and syncs time range with Redux via setTrackCorrectionTimerange

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
