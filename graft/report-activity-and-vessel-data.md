---
name: Report activity and vessel data
slug: report-activity-and-vessel-data
type: system
sources:
  - path: apps/platform/features/_reports/report-area/area-reports.utils.test.ts
    hash: 8613a2e32f10eb36fee22705b0d81e5acec1bab7750f47ffda2390b9b5822b70
sources_digest: 00c66c1c614cccd2b0a3d74f308d7ba6bf64a1c6175582dc01b4c7b389d47206
links:
  - to: area-reports-system-core-logic-selectors
    relation: implements
    description: >-
      Provides vessel filtering logic (getVesselsFiltered) and data formatting
      utilities consumed by area report selectors
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: depends_on
    description: Reads workspace time ranges and dataview configuration for report queries
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Redux logic managing vessel activity data fetching, filtering, and statistics for reports—fetches vessel positions/detections from the API with optional area and time filtering, aggregates activity by dataview/dataset, and provides hooks for executing report queries. Integrates with area report selectors to filter by buffer, gear type, and geographic bounds.

## Related

- implements [[area-reports-system-core-logic-selectors]] — Provides vessel filtering logic (getVesselsFiltered) and data formatting utilities consumed by area report selectors
- depends on [[workspace-state-orchestration-redux-slice-selectors]] — Reads workspace time ranges and dataview configuration for report queries

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
