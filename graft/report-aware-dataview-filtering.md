---
name: Report-Aware Dataview Filtering
slug: report-aware-dataview-filtering
type: concept
sources:
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.instances.selectors.ts
    hash: 295a3e15de1383ecf8888c0f3b0939f23af9edb72409d5c2f46620cd32d7f4df
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.reports.selectors.ts
    hash: 27e6e64455610ec6efc2debcd5cb4aa01cbc7bb62a0f9ebc58832fed0a6c8951
  - path: apps/platform/features/_map/dataviews/selectors/dataviews.selectors.ts
    hash: e505d222dd6f95e259bbd7184f852fcf6e4593414aef6d3aad41081e9d62fb0c
sources_digest: f22f0835d3afc207ca569e6e44c5def9466ab6dc0290eee6d787a7e0771a4e30
links:
  - to: dataview-instance-resolution-pipeline
    relation: depends_on
    description: >-
      selectDataviewInstancesResolvedVisible filters resolved instances based on
      location type and category logic; this is the final visibility gate before
      rendering.
  - to: dataview-type-category-selectors
    relation: implements
    description: >-
      selectActiveReportDataviews and related category selectors enforce
      report-specific filtering rules on top of the resolved instances.
generator:
  version: 1
covers:
  - symbol: findVesselProfileDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.instances.selectors.ts:L45-L67
  - symbol: selectDataviewInstancesByType
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.instances.selectors.ts:L194-L198
  - symbol: selectActiveReportSubCategoriesByCategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.reports.selectors.ts:L41-L52
  - symbol: selectHasSubcategoryDetectionsDataview
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.selectors.ts:L160-L167
  - symbol: getIsDataviewReportSupported
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.selectors.ts:L284-L297
---

<!-- context:generated:start -->

## Summary

Dataview visibility and categorization depends on the current report location context (vessel profile, port report, vessel group report, area report, or global). Selectors branch logic to show/hide specific dataview types, match against report categories and subcategories, and apply filtering rules like restricting port-report events to visit-only or conditioning presence subcategories on vessel-group-report support. The filtering is tightly coupled to Redux router state and report category enums.

## Related

- depends on [[dataview-instance-resolution-pipeline]] — selectDataviewInstancesResolvedVisible filters resolved instances based on location type and category logic; this is the final visibility gate before rendering.
- implements [[dataview-type-category-selectors]] — selectActiveReportDataviews and related category selectors enforce report-specific filtering rules on top of the resolved instances.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
