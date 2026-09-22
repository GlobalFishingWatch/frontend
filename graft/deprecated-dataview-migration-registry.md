---
name: Deprecated Dataview Migration Registry
slug: deprecated-dataview-migration-registry
type: concept
sources:
  - path: apps/platform/features/_map/dataviews/dataviews.hooks.ts
    hash: f6517cd449bf4a48d75421a7b998844a42724199aaab7c14016dcc2b4a266bbd
sources_digest: d390bff08343cf0552ec69987029a13c0f929d99d6537bd11dafa451edc1fb7a
links: []
generator:
  version: 1
covers:
  - symbol: normalizeDataviewFilters
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L32-L41'
  - symbol: areDataviewFiltersEqual
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L43-L46'
  - symbol: areDataviewSourcesEqual
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L48-L49'
  - symbol: getSupportedFilters
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L51-L68'
  - symbol: useMigrateToLatestDataview
    kind: function
    at: 'apps/platform/features/_map/dataviews/dataviews.hooks.ts:L75-L239'
---

<!-- context:generated:start -->

## Summary

Mapping of legacy dataview slugs to modern equivalents via LEGACY_TO_LATEST_DATAVIEWS registry. Migration preserves filter and dataset configurations while reconciling them against the target dataview's schema. The hook useMigrateToLatestDataview exposes batch-migration and toggle operations, using a Map cache during batch ops to avoid redundant API fetches. Excluded categories (Vessels, VesselGroups) cannot be migrated.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
