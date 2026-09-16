---
name: Antimeridian (Date Line) Handling
slug: antimeridian-date-line-handling
type: concept
sources:
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx
    hash: 5e3036a25c79dd5641d4ecf6ba6553b6002cfbe83188a017cf3813f6b69427af
  - path: apps/platform/features/_vessels/vessel/activity/event/event.bounds.ts
    hash: 4aba157b94e837f9f5238c3e558698a7bb7be7a6c91b25eef311c3da9054d551
sources_digest: 1741dbb151e36d01ed6bcf9ead1ffe36e65671e2b2bc40b9d3163952befca433
links: []
generator:
  version: 1
covers:
  - symbol: TrackCorrectionNew
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx:L42-L303
  - symbol: useVesselEventBounds
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event.bounds.ts:L14-L63
---

<!-- context:generated:start -->

## Summary

When track bounds exceed 180° longitude but event coordinates are negative, adds 360° to event longitude to align geometries on same side of antimeridian. Also appears in track correction issue creation (antimeridian normalization of coordinates). Prevents map zooming to disconnected track segments across date line.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
