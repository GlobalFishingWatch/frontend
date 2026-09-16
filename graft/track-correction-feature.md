---
name: Track Correction Feature
slug: track-correction-feature
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/track-correction/track-correction.config.ts
    hash: a08508e5ab4d940f2946099a9e7a91aa761335c1366850f6368c1c1f28a879dd
  - path: >-
      apps/platform/features/_vessels/track-correction/track-correction.constants.ts
    hash: c55105e748e2039d2af2a6d7f8eec88c00337a6cc85ce647f63988cecdce0710
  - path: apps/platform/features/_vessels/track-correction/track-correction.hooks.ts
    hash: 4702f6ea2e460028067727b00172c7f66023ac92614db1c2f24d0db41d7606fa
  - path: apps/platform/features/_vessels/track-correction/track-correction.slice.ts
    hash: 05f777f218857397c1220bed536908e32792fcc52f79077ef516d1304ab12760
  - path: apps/platform/features/_vessels/track-correction/track-correction.utils.ts
    hash: e044086a96b4116b613a837377316f661c924d6d2e93dcb541a6073923108e50
  - path: >-
      apps/platform/features/_vessels/track-correction/track-selection.selectors.ts
    hash: c575f49252a90c2db56edcb07fcbbd4c7bde56ff31d2570a0b52a0ca78966fe9
  - path: apps/platform/features/_vessels/track-correction/TrackCommentsList.tsx
    hash: b655b8fcf354a98328fb7bb30d96a59b2be34504be162678bf5a9ce5ab5d8fe1
  - path: apps/platform/features/_vessels/track-correction/TrackCorrection.tsx
    hash: ec4bbbf4c103659a492205d24352094a67e6c4c58496aeff286c3c07c491a895
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionEdit.tsx
    hash: 1d5f67c3420ea7c3f398321c9278c067a0a32865aaef2fc8a3afab1747485177
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx
    hash: 5e3036a25c79dd5641d4ecf6ba6553b6002cfbe83188a017cf3813f6b69427af
  - path: apps/platform/features/_vessels/track-correction/TrackSlider.tsx
    hash: 4032b1ca6cb32c8950dc6f413791111402ae86bec7c06d62d73c02fa79a48ca3
sources_digest: 694e2d43ec245a1474c49434dc1774744a1be8af2cdcf935429ec4fd086c7f49
links:
  - to: guest-permission-guards
    relation: implements
    description: >-
      Enforces authentication checks, guest user exclusion, and GFW-tier
      permission boundaries for issue resolution
  - to: map-aware-time-selection
    relation: uses
    description: >-
      TrackSlider integrates with map layer vessel track segments for
      GPS-point-aligned time range selection
  - to: redux-state-selectors-pattern
    relation: implements
    description: >-
      Uses Redux slice architecture, memoized selectors, async thunks, and
      workspace-scoped state isolation
  - to: vessel-activity-event-system
    relation: uses
    description: >-
      Track correction feature provides issue reporting for vessel tracking data
      anomalies that belong to the broader activity event tracking context
  - to: workspace-scoped-routing-to-external-systems
    relation: implements
    description: >-
      Routes track corrections to region/source-specific Google Sheets via
      workspace ID mappings from constants
generator:
  version: 1
covers:
  - symbol: TrackCommentsListProps
    kind: interface
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCommentsList.tsx:L13-L15
  - symbol: TrackCommentsList
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCommentsList.tsx:L17-L62
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
  - symbol: getTrackCorrectionIssueOptions
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.config.ts:L12-L19
  - symbol: TurningTidesWorkspaceId
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.constants.ts:L15-L15
  - symbol: useSetTrackCorrectionId
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.hooks.ts:L14-L22
  - symbol: useFetchTrackCorrections
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.hooks.ts:L24-L52
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
  - symbol: getCustomVesselPropertiesByWorkspaceId
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.utils.ts:L27-L59
---

<!-- context:generated:start -->

## Summary

A vessel data quality reporting system allowing users to flag and discuss false positive/negative AIS tracking anomalies, persisting corrections to workspace-specific Google Sheets. Coordinates Redux state management, API communication, canvas-based time-range selection, and workspace-scoped spreadsheet routing.

## Related

- implements [[guest-permission-guards]] — Enforces authentication checks, guest user exclusion, and GFW-tier permission boundaries for issue resolution
- uses [[map-aware-time-selection]] — TrackSlider integrates with map layer vessel track segments for GPS-point-aligned time range selection
- implements [[redux-state-selectors-pattern]] — Uses Redux slice architecture, memoized selectors, async thunks, and workspace-scoped state isolation
- uses [[vessel-activity-event-system]] — Track correction feature provides issue reporting for vessel tracking data anomalies that belong to the broader activity event tracking context
- implements [[workspace-scoped-routing-to-external-systems]] — Routes track corrections to region/source-specific Google Sheets via workspace ID mappings from constants

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
