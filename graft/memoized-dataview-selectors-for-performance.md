---
name: Memoized Dataview Selectors for Performance
slug: memoized-dataview-selectors-for-performance
type: concept
sources:
  - path: apps/platform/features/_map/datasets/datasets.selectors.ts
    hash: 2dba31ceeeb77270b13479ca9fc6778107625da3934b0039a5be714266cd5c7e
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.categories.selectors.ts
    hash: d5b6c8b1372e996df9db04f4c61d0a03f12d71ce6402159ca5792728446efc99
sources_digest: 9efcb109de1f0070d7b635d75725d2d745c8d105a9d8c7481693aa18a15e2822
links: []
generator:
  version: 1
covers:
  - symbol: selectDatasetsByType
    kind: function
    at: 'apps/platform/features/_map/datasets/datasets.selectors.ts:L17-L32'
  - symbol: selectDataviewInstancesByCategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.categories.selectors.ts:L26-L33
  - symbol: selectActiveDataviewInstancesByCategory
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.categories.selectors.ts:L35-L45
---

<!-- context:generated:start -->

## Summary

Dataview and dataset selectors throughout (selectFourwingsDatasets, selectVesselsDatasets, etc.) use Redux createSelector for memoization to prevent unnecessary recomputation when parent datasets haven't changed. Related datasets are deduplicated via uniqBy to avoid rendering duplicates that appear through multiple relationship paths. Category selectors also exclude dataset comparison instances and filter by visibility/report compatibility.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
