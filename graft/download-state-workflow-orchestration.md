---
name: Download State & Workflow Orchestration
slug: download-state-workflow-orchestration
type: system
sources:
  - path: apps/platform/features/_map/download/download.selectors.ts
    hash: 825a2b1869b5d0b47b14175d427765785a7b28f080bf40b9fcb9705b4489d792
  - path: apps/platform/features/_map/download/downloadActivity.slice.ts
    hash: fa7a3d8efdde37a518591ab9a326d0133f086ec0195a57d4f83eb3dc19725272
  - path: apps/platform/features/_map/download/downloadTrack.slice.ts
    hash: c1b2d8daa0bfaec23a8918fc2c34ba2cdd3d548397e02e9a545521dc01ba42a1
sources_digest: fcc27c5a0c049b9135a25491427296b215349379d0e934e5fb7e537a213e3008
links:
  - to: activity-download-timeout-retry-loop
    relation: implements
    description: >-
      downloadActivityLastReportThunk and useActivityDownloadTimeoutRefresh
      implement the retry-on-timeout pattern for long-running downloads.
  - to: download-ui-form-components
    relation: produces
    description: >-
      The slices export selectors that drive modal visibility, loading states,
      and error display in download components.
  - to: download-validation-format-selection
    relation: depends_on
    description: >-
      downloadActivity.slice depends on download.utils functions to filter
      supported options before thunk dispatch.
generator:
  version: 1
covers:
  - symbol: DateRange
    kind: type
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L26-L29'
  - symbol: DownloadActivityState
    kind: interface
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L31-L39'
  - symbol: DownloadActivityParams
    kind: type
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L51-L69'
  - symbol: selectDownloadActivityStatus
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L264-L264'
  - symbol: selectDownloadActivityError
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L265-L265'
  - symbol: selectHadDownloadActivityTimeoutError
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L266-L267'
  - symbol: selectDownloadActivityErrorMsg
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L268-L269'
  - symbol: selectDownloadActivityAreaKey
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L270-L270'
  - symbol: selectDownloadActiveTabId
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.slice.ts:L271-L271'
  - symbol: VesselParams
    kind: type
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L17-L21'
  - symbol: DownloadTrackState
    kind: interface
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L23-L30'
  - symbol: DownloadTrackParams
    kind: type
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L41-L48'
  - symbol: parseRateLimit
    kind: function
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L50-L57'
  - symbol: RejectValueType
    kind: type
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L59-L59'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L182-L182'
---

<!-- context:generated:start -->

## Summary

Redux slices (downloadActivity.slice, downloadTrack.slice) manage async workflows for downloading heatmap activity reports and vessel tracks from the GFW API. They handle thunk orchestration with conditional execution (primary vs. retry-on-timeout), file format conversion (GeoJSON→KML via jszip), rate-limit tracking, and UI state (active tabs, selected areas, modal visibility). Selectors compose state to drive download UI components with granular access to status, errors, and rate limits.

## Related

- implements [[activity-download-timeout-retry-loop]] — downloadActivityLastReportThunk and useActivityDownloadTimeoutRefresh implement the retry-on-timeout pattern for long-running downloads.
- produces [[download-ui-form-components]] — The slices export selectors that drive modal visibility, loading states, and error display in download components.
- depends on [[download-validation-format-selection]] — downloadActivity.slice depends on download.utils functions to filter supported options before thunk dispatch.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
