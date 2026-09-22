---
name: Activity Report Redux State
slug: activity-report-redux-state
type: system
sources:
  - path: apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts
    hash: b201e973969ff0a0227bd73087b35991961967a5e142c9c85e0d21b666fc1a56
  - path: apps/platform/features/_reports/tabs/activity/reports-activity.types.ts
    hash: b6e6158984ad30696eff01766293c3e024c48ee110fa1386e585d7d5a2ccff0b
  - path: apps/platform/features/_reports/tabs/activity/reports-activity.utils.ts
    hash: 321e013bb48e76494c49f19386d43f61098ff36bc78707b9e747254fd8a7b7d3
sources_digest: ecc6fbca4899f6a0ea0fed31fb790d447b6426712bd496f8a7af58df40530987
links:
  - to: activity-report-ui-components
    relation: produces
    description: >-
      Provides Redux state via selectors consumed by UI components to configure
      graph rendering and comparison options
  - to: vessel-activity-data
    relation: produces
    description: >-
      Manages fetched vessel report data via fetchReportVesselsThunk, exposed
      through selectReportVesselsData selector
generator:
  version: 1
covers:
  - symbol: HotspotSettings
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L29-L33
  - symbol: PreviewBuffer
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L41-L45
  - symbol: ReportStateError
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L53-L53
  - symbol: ReportState
    kind: interface
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L54-L62
  - symbol: ReportSliceState
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L64-L64
  - symbol: ReportRegion
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L75-L78
  - symbol: FetchReportVesselsThunkParams
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L80-L97
  - symbol: getReportQuery
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L112-L160
  - symbol: getReportRequestHash
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L189-L202
  - symbol: LazyLoadedSlices
    kind: interface
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.slice.ts:L272-L272
  - symbol: ReportTimeComparisonValues
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.types.ts:L1-L6
  - symbol: ReportActivityUnit
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.types.ts:L8-L8
  - symbol: getReportSubCategoryLabel
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity.utils.ts:L6-L24
---

<!-- context:generated:start -->

## Summary

Redux Toolkit slice managing activity report state including vessel data fetching, filtering, UI state for hotspot analysis and buffer previews, and deduplication via request hash. Exports async thunk fetchReportVesselsThunk for 4wings API calls, synchronous actions for UI state (resetReportData, setPreviewBuffer, setReportHotspotSettings), and typed selectors for report data, status, and settings.

## Related

- produces [[activity-report-ui-components]] — Provides Redux state via selectors consumed by UI components to configure graph rendering and comparison options
- produces [[vessel-activity-data]] — Manages fetched vessel report data via fetchReportVesselsThunk, exposed through selectReportVesselsData selector

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
