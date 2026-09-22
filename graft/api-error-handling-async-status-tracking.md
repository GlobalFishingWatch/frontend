---
name: API Error Handling & Async Status Tracking
slug: api-error-handling-async-status-tracking
type: concept
sources:
  - path: apps/platform/features/_vessels/track-correction/track-correction.slice.ts
    hash: 05f777f218857397c1220bed536908e32792fcc52f79077ef516d1304ab12760
  - path: apps/platform/features/_vessels/track-correction/TrackCorrection.tsx
    hash: ec4bbbf4c103659a492205d24352094a67e6c4c58496aeff286c3c07c491a895
sources_digest: 7583a154ed5973e04fcd176ee561bd7374588c7dc87a0e8994bad2f7a45658ca
links:
  - to: track-correction-feature
    relation: implements
    description: >-
      createNewIssueThunk, createCommentThunk, fetchTrackIssuesThunk coordinate
      async state transitions
generator:
  version: 1
covers:
  - symbol: TrackCorrection
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrection.tsx:L20-L48
  - symbol: IssueType
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L10-L10
  - symbol: TrackCorrectionComment
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L12-L23
  - symbol: TrackCorrection
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L25-L46
  - symbol: TrackCorrectionState
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L48-L59
  - symbol: CreateNewIssueThunkParam
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L74-L78
  - symbol: CreateCommentThunkParam
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L111-L115
  - symbol: FetchTrackCorrectionsThunkParam
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L144-L146
  - symbol: selectTrackCorrectionVesselDataviewId
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L231-L232
  - symbol: selectTrackCorrectionTimerange
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L234-L235
  - symbol: selectTrackIssueType
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L237-L237
  - symbol: selectTrackIssueComment
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L239-L239
  - symbol: selectTrackCorrectionState
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L241-L241
  - symbol: selectWorkspacesTrackCorrectionIssues
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.slice.ts:L243-L244
---

<!-- context:generated:start -->

## Summary

Track correction slice uses AsyncReducerStatus enum to track loading states (PENDING, FINISHED, ERROR). parseAPIError from GFW API client extracts error messages. Graceful fallbacks return empty arrays on fetch failure. Workspace-scoped normalization prevents cross-workspace state pollution.

## Related

- implements [[track-correction-feature]] — createNewIssueThunk, createCommentThunk, fetchTrackIssuesThunk coordinate async state transitions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
