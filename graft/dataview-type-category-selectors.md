---
name: Dataview Type & Category Selectors
slug: dataview-type-category-selectors
type: system
sources:
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.reports.selectors.ts
    hash: 27e6e64455610ec6efc2debcd5cb4aa01cbc7bb62a0f9ebc58832fed0a6c8951
  - path: apps/platform/features/_map/dataviews/selectors/dataviews.selectors.ts
    hash: e505d222dd6f95e259bbd7184f852fcf6e4593414aef6d3aad41081e9d62fb0c
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.static.selectors.ts
    hash: 0b0d5d7f40a33fc39a3e2336769ca63bdcfd57ad480158ea362adc44e72a9128
sources_digest: 6964117e1cbe9f8605c391e3b1cc444e8cd66776e07d26058e72cb8cbe9b5a68
links:
  - to: activity-category-dataset-matching
    relation: uses
    description: >-
      Presence and fishing dataview filters match dataviews by dataset
      subcategory using getReportCategoryFromDataview and activity-based filter
      patterns.
  - to: dataview-instance-resolution-pipeline
    relation: depends_on
    description: >-
      All selectors ultimately filter from selectDataviewInstancesResolved or
      selectDataviewInstancesMerged.
  - to: report-aware-dataview-filtering
    relation: depends_on
    description: >-
      selectActiveReportDataviews uses selectDataviewInstancesResolvedVisible
      and branches on report category logic.
generator:
  version: 1
covers:
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
  - symbol: selectActivityDataviewsBySubcategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.static.selectors.ts:L24-L33
---

<!-- context:generated:start -->

## Summary

Redux selectors that filter dataview instances by type (track, vessel, event, environmental, context-area) and activity category (presence, fishing, heatmap). They compose lower-level selectors to produce domain-specific views: selectActiveDataviews aggregates all active types, selectActiveReportDataviews routes to reports by category, and category-specific queries like selectActiveTemporalgridDataviews or selectHasFishingDataviews provide boolean flags and lists for conditional UI rendering.

## Related

- uses [[activity-category-dataset-matching]] — Presence and fishing dataview filters match dataviews by dataset subcategory using getReportCategoryFromDataview and activity-based filter patterns.
- depends on [[dataview-instance-resolution-pipeline]] — All selectors ultimately filter from selectDataviewInstancesResolved or selectDataviewInstancesMerged.
- depends on [[report-aware-dataview-filtering]] — selectActiveReportDataviews uses selectDataviewInstancesResolvedVisible and branches on report category logic.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
