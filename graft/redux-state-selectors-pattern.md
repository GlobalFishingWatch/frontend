---
name: Redux State & Selectors Pattern
slug: redux-state-selectors-pattern
type: concept
sources:
  - path: apps/platform/features/_vessels/track-correction/track-correction.slice.ts
    hash: 05f777f218857397c1220bed536908e32792fcc52f79077ef516d1304ab12760
  - path: >-
      apps/platform/features/_vessels/track-correction/track-selection.selectors.ts
    hash: c575f49252a90c2db56edcb07fcbbd4c7bde56ff31d2570a0b52a0ca78966fe9
  - path: >-
      apps/platform/features/_vessels/vessel/activity/event/event-activity.hooks.ts
    hash: 4304648e0603fa058e2ade5c500e5137e4dea9d3be94d350bfed84efb2a1a2bd
  - path: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts
    hash: 64227dacee4da1f87e848124928a989ae611576778103ca7d5326469d24ec0b6
  - path: >-
      apps/platform/features/_vessels/vessel/activity/vessels-activity.selectors.ts
    hash: a0ed8cd43c8ab06ebe87377f89855283e30bb0d991a52290e67ae54aaeebc63d
sources_digest: b8919fc7f92105dc20bd5cc54148cf5e3c440b10ff830443d09360457cf8929a
links:
  - to: track-correction-feature
    relation: implements
    description: >-
      Track correction slice manages normalized workspacesIssues map with async
      metadata, preventing refetch across workspace switches
  - to: vessel-activity-event-system
    relation: implements
    description: >-
      ActivityEvent interface extends ApiEvent with voyage/subType, selectors
      compute grouped views conditionally based on activity mode
  - to: vessel-identity-fields
    relation: uses
    description: >-
      Vessel identity display depends on Redux selectors to fetch combined
      source info and user tier for permission-based rendering
generator:
  version: 1
covers:
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
  - symbol: useEventActivityToggle
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-activity.hooks.ts:L18-L53
  - symbol: useVirtuosoScroll
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L33-L63
  - symbol: useVirtuosoScrollToEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L65-L109
  - symbol: useVesselProfileScrollToEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L111-L135
  - symbol: useEventsScroll
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L137-L216
  - symbol: ActivityEvent
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/vessels-activity.selectors.ts:L22-L25
---

<!-- context:generated:start -->

## Summary

Pervasive use of Redux Toolkit slices with async thunks, memoized selectors via createSelector, workspace-scoped state isolation, and AsyncReducerStatus for async operation tracking. Enables efficient re-renders by deriving computed state from normalized stores.

## Related

- implements [[track-correction-feature]] — Track correction slice manages normalized workspacesIssues map with async metadata, preventing refetch across workspace switches
- implements [[vessel-activity-event-system]] — ActivityEvent interface extends ApiEvent with voyage/subType, selectors compute grouped views conditionally based on activity mode
- uses [[vessel-identity-fields]] — Vessel identity display depends on Redux selectors to fetch combined source info and user tier for permission-based rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
