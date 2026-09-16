---
name: Activity Category & Dataset Matching
slug: activity-category-dataset-matching
type: concept
sources:
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.reports.selectors.ts
    hash: 27e6e64455610ec6efc2debcd5cb4aa01cbc7bb62a0f9ebc58832fed0a6c8951
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.static.selectors.ts
    hash: 0b0d5d7f40a33fc39a3e2336769ca63bdcfd57ad480158ea362adc44e72a9128
sources_digest: 69ac53ff2bebc46ffd9dfc9b585ea8dd786e6904d4672a23778180ef9ba9d105
links:
  - to: dataview-type-category-selectors
    relation: implements
    description: >-
      selectPresenceDataviews, selectFishingDataviews, and
      selectActiveReportSubCategoriesByCategory use this pattern to filter
      without hardcoded slugs.
generator:
  version: 1
covers:
  - symbol: selectActiveReportSubCategoriesByCategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.reports.selectors.ts:L41-L52
  - symbol: selectActivityDataviewsBySubcategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.static.selectors.ts:L24-L33
---

<!-- context:generated:start -->

## Summary

Dataviews are filtered and categorized by their contained datasets' activity properties (presence, fishing, environment) and subcategories via utility functions like getReportCategoryFromDataview and selectActivityDataviewsBySubcategory. This pattern avoids hardcoding slugs for individual dataviews and enables flexible filtering by activity type. Dataset comparison entries are filtered out via DATASET_COMPARISON_SUFFIX pattern matching. Deduplication uses `uniq` to handle overlaps across configurations.

## Related

- implements [[dataview-type-category-selectors]] — selectPresenceDataviews, selectFishingDataviews, and selectActiveReportSubCategoriesByCategory use this pattern to filter without hardcoded slugs.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
