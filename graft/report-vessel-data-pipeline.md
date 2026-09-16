---
name: Report Vessel Data Pipeline
slug: report-vessel-data-pipeline
type: system
sources:
  - path: apps/platform/features/_reports/shared/vessels/report-vessels.config.ts
    hash: c270287bc41f7e89e2f1f309cda85a97f0dedadc27b5546331b742683794beb8
  - path: apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts
    hash: a5cdfa621b1192695a9d10118d6365026cac95a18c0fd87f5a5c11bf2af8d66a
  - path: apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts
    hash: 68dd68e5e4565e310da86cbe5c4e9da4cd40888545a7854d117056a8842bcc69
  - path: apps/platform/features/_reports/shared/vessels/report-vessels.types.ts
    hash: c0b3627c11c1a1c44b724a309974e6084e48e58f5ec8e810d765489725c1d9e9
sources_digest: 35b0ae1545dccd4ec1bd5d0cf987a11767212ea343ad0a493c174703c7d46f6f
links:
  - to: category-based-report-filtering
    relation: depends_on
    description: >-
      Selectors branch vessel transformation logic based on report category
      (Activity, Detections, VesselGroup, Events) with different field
      extraction paths
  - to: report-visualization-components
    relation: produces
    description: >-
      Emits normalized vessel table data, graph-ready aggregations
      (ReportVesselsGraphAggregatedData), and pagination metadata consumed by
      ReportVesselsTable and ReportVesselsGraph
  - to: vessel-pinning-and-workspace-integration
    relation: depends_on
    description: >-
      report-vessels.hooks fetches full vessel identity data and manages
      dataview persistence for pinned vessels through workspace infrastructure
generator:
  version: 1
covers:
  - symbol: FilterProperty
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.config.ts:L1-L1
  - symbol: ReportFilterProperty
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.config.ts:L10-L10
  - symbol: usePopulateVesselResource
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts:L37-L64
  - symbol: populateVesselInfoResource
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts:L39-L62
  - symbol: usePinReportVessels
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts:L66-L166
  - symbol: getVesselSource
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts:L50-L60
  - symbol: VesselGroupVessel
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts:L62-L65
  - symbol: getVesselDatasetsWithoutEventsRelated
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.selectors.ts:L368-L385
  - symbol: ReportVesselValues
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.types.ts:L1-L4
  - symbol: ReportTableVessel
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.types.ts:L6-L32
---

<!-- context:generated:start -->

## Summary

A comprehensive subsystem for transforming raw vessel data into formatted table rows, graph-ready aggregations, and filtered views. Manages vessel filtering by identity properties (name, flag, mmsi, type, gear, source), pagination, sorting, and generation of visualization data across multiple report categories.

## Related

- depends on [[category-based-report-filtering]] — Selectors branch vessel transformation logic based on report category (Activity, Detections, VesselGroup, Events) with different field extraction paths
- produces [[report-visualization-components]] — Emits normalized vessel table data, graph-ready aggregations (ReportVesselsGraphAggregatedData), and pagination metadata consumed by ReportVesselsTable and ReportVesselsGraph
- depends on [[vessel-pinning-and-workspace-integration]] — report-vessels.hooks fetches full vessel identity data and manages dataview persistence for pinned vessels through workspace infrastructure

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
