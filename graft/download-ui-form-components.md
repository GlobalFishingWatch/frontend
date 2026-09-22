---
name: Download UI & Form Components
slug: download-ui-form-components
type: system
sources:
  - path: apps/platform/features/_map/download/DownloadActivityByVessel.tsx
    hash: 8f147d423bbcf5f552c0fc92e62710ab0756aa632815eeb6da5362d76f72841c
  - path: apps/platform/features/_map/download/DownloadActivityEnvironment.tsx
    hash: 6097a45993c8f91f4719e1b13cd3bb93519b9b53eb55a578fdf5bf4a68503d4d
  - path: apps/platform/features/_map/download/DownloadActivityError.tsx
    hash: 50fd062d885564efef22c4f23144cfb5dccaea53c3141d00c9389dcdd51c614b
  - path: apps/platform/features/_map/download/DownloadActivityGridded.tsx
    hash: 02bea4493c60d98a2612f970a5ff49ea93f25324a03c1d3bd587a35dce3d2db3
  - path: apps/platform/features/_map/download/DownloadActivityModal.tsx
    hash: 370189de2a38fbc18256ae1399c18dae89f16b5a7ff606171ba79d3b9a337a45
  - path: apps/platform/features/_map/download/DownloadActivityProductsBanner.tsx
    hash: 7b84dbb4ede6447c201f84bf54e643b8098056028e04520115f1b652dbd2ba50
  - path: apps/platform/features/_map/download/DownloadAreaLabel.tsx
    hash: 122366c1140ef9675ee87662d3fbb868e5b4f828ace3fabfd3b93757ff08d564
  - path: apps/platform/features/_map/download/DownloadSurvey.tsx
    hash: c51c22d37f8b8ba1f8712cef8989ff96278e19d98476c2411f03578621379a4f
sources_digest: 3a6de46d5dbf2bd1785f2ab0083082f30efd08e185ba2c5bf3d4a22c35efdb71
links:
  - to: activity-download-timeout-retry-loop
    relation: uses
    description: >-
      DownloadActivityGridded and DownloadActivityEnvironment components use
      useActivityDownloadTimeoutRefresh hook for automatic retry on timeout.
  - to: download-state-workflow-orchestration
    relation: depends_on
    description: >-
      Components dispatch downloadActivityThunk and downloadTrackThunk, and read
      state via selectors from downloadActivity.slice and downloadTrack.slice.
  - to: download-validation-format-selection
    relation: uses
    description: >-
      Components call getSupportedGroupByOptions,
      getSupportedTemporalResolutions, and getDownloadReportSupported to filter
      available choices.
generator:
  version: 1
covers:
  - symbol: DownloadActivityByVessel
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityByVessel.tsx:L63-L259'
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_map/download/DownloadActivityByVessel.tsx:L108-L169
  - symbol: DownloadActivityGridded
    kind: function
    at: >-
      apps/platform/features/_map/download/DownloadActivityEnvironment.tsx:L67-L278
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_map/download/DownloadActivityEnvironment.tsx:L125-L200
  - symbol: ActivityDownloadError
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityError.tsx:L16-L41'
  - symbol: DownloadActivityGridded
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityGridded.tsx:L77-L335'
  - symbol: onDownloadClick
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityGridded.tsx:L147-L226'
  - symbol: DownloadActivityModal
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityModal.tsx:L32-L116'
  - symbol: onTabClick
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityModal.tsx:L85-L87'
  - symbol: onClose
    kind: function
    at: 'apps/platform/features/_map/download/DownloadActivityModal.tsx:L89-L95'
  - symbol: DownloadActivityProductsBanner
    kind: function
    at: >-
      apps/platform/features/_map/download/DownloadActivityProductsBanner.tsx:L13-L48
  - symbol: DownloadAreaLabel
    kind: function
    at: 'apps/platform/features/_map/download/DownloadAreaLabel.tsx:L23-L77'
  - symbol: DownloadSurvey
    kind: function
    at: 'apps/platform/features/_map/download/DownloadSurvey.tsx:L22-L79'
---

<!-- context:generated:start -->

## Summary

React components (DownloadActivityModal, DownloadActivityByVessel, DownloadActivityGridded, DownloadActivityEnvironment) provide tabbed modal interfaces for users to select download formats, grouping, temporal/spatial resolution, and trigger downloads. Components validate permissions via checkDatasetReportPermission, enforce area-size constraints via turf.area, and track analytics. Error and survey components display outcomes and collect feedback. DownloadAreaLabel renders the target area with optional GeoJSON export.

## Related

- uses [[activity-download-timeout-retry-loop]] — DownloadActivityGridded and DownloadActivityEnvironment components use useActivityDownloadTimeoutRefresh hook for automatic retry on timeout.
- depends on [[download-state-workflow-orchestration]] — Components dispatch downloadActivityThunk and downloadTrackThunk, and read state via selectors from downloadActivity.slice and downloadTrack.slice.
- uses [[download-validation-format-selection]] — Components call getSupportedGroupByOptions, getSupportedTemporalResolutions, and getDownloadReportSupported to filter available choices.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
