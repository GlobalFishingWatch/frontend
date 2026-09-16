---
name: Map Data Selectors
slug: map-data-selectors
type: system
sources:
  - path: apps/platform/features/_map/map/map.selectors.ts
    hash: 68e1ba0443eda4e56b6159677b8d97722c45abc8c7c474450e52f318cb9f33a3
sources_digest: 57e31c4dd0e6255349d43701779d2882f5b3a5149aa4dece4d434fe57c2c83fc
links:
  - to: map-configuration-constants
    relation: uses
    description: References layer IDs and buffer styling constants
  - to: redux-state-slices
    relation: depends_on
    description: >-
      Depends on datasets, workspaces-list, area-reports, and routes Redux
      selectors
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Transforms Redux workspace, dataset, and buffer state into GeoJSON-compatible dataview objects for map rendering. Provides memoized selectors for workspace list dataviews, report buffer dataviews (supporting active/preview styling), workspace detail visibility determination, and dataset editing context. Guards against missing geometries and uses EMPTY_ARRAY sentinels for filtered results.

## Related

- uses [[map-configuration-constants]] — References layer IDs and buffer styling constants
- depends on [[redux-state-slices]] — Depends on datasets, workspaces-list, area-reports, and routes Redux selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
