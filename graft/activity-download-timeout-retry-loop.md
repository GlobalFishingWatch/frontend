---
name: Activity Download Timeout Retry Loop
slug: activity-download-timeout-retry-loop
type: concept
sources:
  - path: apps/platform/features/_map/download/downloadActivity.hooks.ts
    hash: f0e00e249da12feec38e66f63a60c16b3409ba3406fbba8d3e70c5b17cbf1093
  - path: apps/platform/features/_map/download/downloadActivity.slice.ts
    hash: fa7a3d8efdde37a518591ab9a326d0133f086ec0195a57d4f83eb3dc19725272
  - path: apps/platform/features/_map/download/DownloadActivityModal.tsx
    hash: 370189de2a38fbc18256ae1399c18dae89f16b5a7ff606171ba79d3b9a337a45
sources_digest: b34aa5ad1fa212a11f1f001a86184c9428fd11e2790b401a5051bf604e78a3d5
links:
  - to: download-state-workflow-orchestration
    relation: implements
    description: >-
      The retry loop is implemented via downloadActivityLastReportThunk with
      conditional execution and interval polling.
  - to: download-ui-form-components
    relation: uses
    description: >-
      useActivityDownloadTimeoutRefresh hook is consumed by download components
      to auto-retry; modal dispatches resetDownloadActivityStateKeepPolling vs.
      resetDownloadActivityState based on error state.
generator:
  version: 1
covers:
  - symbol: DownloadActivityModal
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityModal.tsx:L32-L116'
  - symbol: onTabClick
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityModal.tsx:L85-L87'
  - symbol: onClose
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityModal.tsx:L89-L95'
  - symbol: useActivityDownloadTimeoutRefresh
    kind: function
    at: 'apps/platform/features/_map/download/downloadActivity.hooks.ts:L11-L30'
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
---

<!-- context:generated:start -->

## Summary

Long-running activity downloads may timeout; when detected, a retry mechanism polls the `/4wings/last-report` endpoint every 10 seconds via downloadActivityLastReportThunk. The useActivityDownloadTimeoutRefresh hook subscribes to selectHadDownloadActivityTimeoutError and manages an interval ref that cleans up when the error clears. The polling thunk only executes if a prior timeout error exists, and the modal resets state conditionally to preserve/clear polling on dismissal.

## Related

- implements [[download-state-workflow-orchestration]] — The retry loop is implemented via downloadActivityLastReportThunk with conditional execution and interval polling.
- uses [[download-ui-form-components]] — useActivityDownloadTimeoutRefresh hook is consumed by download components to auto-retry; modal dispatches resetDownloadActivityStateKeepPolling vs. resetDownloadActivityState based on error state.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
