---
name: Vessel Group Report Feature
slug: vessel-group-report-feature
type: system
sources:
  - path: apps/platform/features/_reports/report-vessel-group/VesselGroupReport.tsx
    hash: 7f580f36056311532908c493ddc0809a83d9c822a07b572984b60e44da37e586
  - path: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportError.tsx
    hash: 3f10ec815f2feaee809b6f416e032365697c0107d32d6b2545e4a32bcef2042d
  - path: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportLink.tsx
    hash: f1cffbb65f2d9eba959ae15fee56bbe98dd98b6d5b868c14c7281200751a87e6
  - path: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportTitle.tsx
    hash: 506920e24ebd948b0b0670ab0ed5c98fbe10a74323cd0f60ddc7b14f69b7cdd3
sources_digest: 870d0312fc79af3fd59811505ec245a0a94f3e708cef76ab968591376b5ec31a
links:
  - to: modal-state-management
    relation: uses
    description: >-
      Dispatches modal actions for vessel group editing workflows via title
      component
  - to: report-timeseries-pipeline
    relation: uses
    description: >-
      Renders activity and event tabs that depend on timeseries data fetching
      and graph statistics
  - to: vessel-group-report-configuration
    relation: uses
    description: >-
      Consumes dataview factories and dataset configuration for activity and
      event views
  - to: vessel-group-report-state-management
    relation: depends_on
    description: >-
      Selects vessel group data, loading status, time ranges, and ownership
      context from Redux
generator:
  version: 1
covers:
  - symbol: VesselGroupReport
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReport.tsx:L55-L206
  - symbol: VesselGroupReportError
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportError.tsx:L12-L57
  - symbol: VesselGroupReportLinkProps
    kind: type
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportLink.tsx:L16-L19
  - symbol: VesselGroupReportLink
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportLink.tsx:L21-L51
  - symbol: analysisRedirect
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportLink.tsx:L24-L30
  - symbol: VesselGroupReportTitle
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportTitle.tsx:L42-L174
---

<!-- context:generated:start -->

## Summary

Provides comprehensive reporting UI for vessel groups in the Global Fishing Watch platform, delivering tabbed analytics across vessels, insights, activity, and events. Orchestrates data fetching, timebar/map synchronization, and handles deprecated vessel group migration workflows.

## Related

- uses [[modal-state-management]] — Dispatches modal actions for vessel group editing workflows via title component
- uses [[report-timeseries-pipeline]] — Renders activity and event tabs that depend on timeseries data fetching and graph statistics
- uses [[vessel-group-report-configuration]] — Consumes dataview factories and dataset configuration for activity and event views
- depends on [[vessel-group-report-state-management]] — Selects vessel group data, loading status, time ranges, and ownership context from Redux

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
