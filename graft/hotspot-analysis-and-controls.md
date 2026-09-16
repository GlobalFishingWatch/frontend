---
name: Hotspot Analysis and Controls
slug: hotspot-analysis-and-controls
type: system
sources:
  - path: apps/platform/features/_reports/tabs/activity/ReportHotspotControls.tsx
    hash: bc101d7e23cb4aef8c62e5e005c8de2789827962d6328c50e7228b25ade9912e
sources_digest: a9b46d5b4e6b8be2591962c2dbe7298c81b5c33c39478f6ce4251fcaf8533162
links:
  - to: activity-report-redux-state
    relation: depends_on
    description: >-
      Reads selectTimeRange, selectReportArea, selectReportActivitySubCategory
      to provide context for hotspot creation and naming
  - to: analytics-and-navigation
    relation: uses
    description: >-
      Integrates with datasets API and workspace dataview system to persist
      hotspots as new datasets
generator:
  version: 1
covers:
  - symbol: ReportHotspotControls
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportHotspotControls.tsx:L39-L196
  - symbol: handleRemove
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportHotspotControls.tsx:L112-L115
  - symbol: togglePanelOpen
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportHotspotControls.tsx:L117-L122
  - symbol: handleClickOutside
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportHotspotControls.tsx:L124-L124
---

<!-- context:generated:start -->

## Summary

UI component and supporting utilities for configuring and saving activity hotspots within report analysis workflows. Allows users to adjust area thresholds via slider (1% to 80% of report area), toggle between metric units (kilometers, nautical miles), and persist hotspot geometries as datasets via the datasets API and workspace integration.

## Related

- depends on [[activity-report-redux-state]] — Reads selectTimeRange, selectReportArea, selectReportActivitySubCategory to provide context for hotspot creation and naming
- uses [[analytics-and-navigation]] — Integrates with datasets API and workspace dataview system to persist hotspots as new datasets

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
