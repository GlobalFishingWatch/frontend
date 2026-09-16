---
name: Insight Data Loading & Error Handling
slug: insight-data-loading-error-handling
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/insights/InsightCoverage.tsx
    hash: 4188b5cb9662d742992eadc1767dff317b125d0a45b6fd2eec0436436ff698a0
  - path: apps/platform/features/_vessels/vessel/insights/InsightErrorMessage.tsx
    hash: e2d9456480927df06fe0648d30ff1d894447ceddd233d17b1833462c5bb5f102
  - path: apps/platform/features/_vessels/vessel/insights/InsightFishing.tsx
    hash: 08fde6b31d989b7cc4ae0f10bbdfb58ce61f517d87c01aaef5657d8333ca0891
  - path: apps/platform/features/_vessels/vessel/insights/InsightFlagChanges.tsx
    hash: 71c7374ad53edea61feec62e926e2da7cd6096e9e52a65d883a407cb456bbfa7
  - path: apps/platform/features/_vessels/vessel/insights/InsightGaps.tsx
    hash: 54ada34cc0d74671aa55032e5df628a112e5fba49de65813fb52e4a3f923c58a
  - path: apps/platform/features/_vessels/vessel/insights/InsightIUU.tsx
    hash: 8d44c866b346f85fc79738e10fb4644a993b58a4591013fabf967d7dad548e24
  - path: apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx
    hash: a38ccc18c14cc3b52a8a85cee95a8d90303000f8423a742b963691c3cbdbc3b9
  - path: apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx
    hash: d1ad08f6a3d490be40a329f76a7d27ac112f19884d776da0d92daefc84279ae0
  - path: apps/platform/features/_vessels/vessel/insights/InsightWrapper.tsx
    hash: dfe0621ec58c28fb528951f4f774bb42b10d639ae98e18e7751de04ccfb0c6be
sources_digest: b4a166c7afa63e447461a4b3f506ef046e90b77d56bb2f194ea1f34b18a2bf40
links:
  - to: vessel-insights-display-system
    relation: part_of
    description: >-
      Error and loading state management is consistent across all insight
      display components
generator:
  version: 1
covers:
  - symbol: InsightCoverage
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightCoverage.tsx:L13-L52
  - symbol: InsightError
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightErrorMessage.tsx:L8-L21
  - symbol: InsightFishing
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightFishing.tsx:L18-L114
  - symbol: InsightFlagChanges
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightFlagChanges.tsx:L17-L70
  - symbol: InsightGaps
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/InsightGaps.tsx:L15-L66'
  - symbol: InsightIUU
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/InsightIUU.tsx:L11-L47'
  - symbol: InsightLongline
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L37-L149
  - symbol: onShowOnMapClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L86-L91
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightLongline.tsx:L93-L104
  - symbol: InsightMOUList
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx:L17-L194
  - symbol: getMOUListAppearance
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx:L68-L172
  - symbol: InsightWrapper
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/InsightWrapper.tsx:L23-L79'
---

<!-- context:generated:start -->

## Summary

Pattern managing asynchronous insight data fetching with loading placeholders and error displays. InsightWrapper uses useGetVesselInsightQuery (skipped for LONGLINE type), dispatches dataset population thunks, and passes isLoading/error props to specialized insight components which render InsightError for failures or custom empty-state placeholders. Constraint: LONGLINE insight bypasses API query and reads from workspace longlineSetsInsight selector instead.

## Related

- part of [[vessel-insights-display-system]] — Error and loading state management is consistent across all insight display components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
