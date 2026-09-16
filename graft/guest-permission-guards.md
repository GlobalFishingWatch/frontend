---
name: Guest & Permission Guards
slug: guest-permission-guards
type: concept
sources:
  - path: apps/platform/features/_vessels/track-correction/TrackCorrection.tsx
    hash: ec4bbbf4c103659a492205d24352094a67e6c4c58496aeff286c3c07c491a895
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionEdit.tsx
    hash: 1d5f67c3420ea7c3f398321c9278c067a0a32865aaef2fc8a3afab1747485177
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx
    hash: 5e3036a25c79dd5641d4ecf6ba6553b6002cfbe83188a017cf3813f6b69427af
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivityDownload.tsx
    hash: a577bb16229d5693f2e9f8db9a415473db0be974ffbf370524e5638c57832b01
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityCombinedSourceField.tsx
    hash: 9d3f80eb13f2d74642519117e9857c221d7bb875f98873cb7d6417a7d47a2096
sources_digest: a7270aec40728c4c071f55e2753149e770ccd54b47a577923295be6fd9c16ac1
links:
  - to: track-correction-feature
    relation: implements
    description: >-
      TrackCorrection container checks selectIsGuestUser and shows login link;
      TrackCorrectionEdit limits resolution to GFW users
  - to: vessel-activity-event-system
    relation: implements
    description: >-
      VesselActivityDownload wraps export button in authentication check via
      UserLoggedIconButton
generator:
  version: 1
covers:
  - symbol: TrackCorrection
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrection.tsx:L20-L48
  - symbol: ActionType
    kind: enum
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrectionEdit.tsx:L37-L41
  - symbol: TrackCorrectionEdit
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrectionEdit.tsx:L43-L326
  - symbol: TrackCorrectionNew
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx:L42-L303
  - symbol: VesselActivityDownload
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/VesselActivityDownload.tsx:L19-L64
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/VesselActivityDownload.tsx:L29-L48
  - symbol: VesselIdentityCombinedSourceFieldProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityCombinedSourceField.tsx:L18-L21
  - symbol: VesselIdentityCombinedSourceField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityCombinedSourceField.tsx:L22-L109
---

<!-- context:generated:start -->

## Summary

Consistent authentication enforcement across features: track correction blocks guest access with login prompts; event download wrapped in UserLoggedIconButton; track correction resolution gated to GFW-tier users only. Redux selectors (selectIsGuestUser, selectIsGFWUser) provide guard predicates.

## Related

- implements [[track-correction-feature]] — TrackCorrection container checks selectIsGuestUser and shows login link; TrackCorrectionEdit limits resolution to GFW users
- implements [[vessel-activity-event-system]] — VesselActivityDownload wraps export button in authentication check via UserLoggedIconButton

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
