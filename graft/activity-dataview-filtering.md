---
name: Activity Dataview Filtering
slug: activity-dataview-filtering
type: system
sources:
  - path: apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx
    hash: 90ace3fa2c1e19bd8297d33561b17d5d9f492913600805b93ae4f400f6767394
  - path: apps/platform/features/_map/workspace/activity/TurningTidesTags.tsx
    hash: b87a312f2c69bcf49f8808f8b45ed767ad5722fc13342c322096745528e85254
sources_digest: fa64d51fa06ccc295a1fe61b5a924440dab80a0749349187a0a19c674a15b03c
links:
  - to: activity-dataview-management-system
    relation: part_of
    description: >-
      Filtering UI is embedded in ActivityLayerPanel for activity-specific data
      constraints
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      TurningTidesFilters and TurningTidesTags read selectVesselsDataviews to
      fetch vessel metadata for filtering options
generator:
  version: 1
covers:
  - symbol: LayerFiltersProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx:L19-L22
  - symbol: TurningTidesFilters
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx:L24-L98
  - symbol: onConfirmFilters
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx:L42-L57
  - symbol: onSelectVesselsClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx:L59-L61
  - symbol: onRemoveVesselsClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx:L63-L65
  - symbol: onCleanClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx:L67-L69
  - symbol: LayerFiltersProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesTags.tsx:L18-L20
  - symbol: TurningTidesTags
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesTags.tsx:L22-L64
  - symbol: onRemoveFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/activity/TurningTidesTags.tsx:L37-L47
---

<!-- context:generated:start -->

## Summary

Provides schema-based and Turning Tides-specific filtering interfaces for activity dataviews. ActivityFilters manages standard fields (type, flag, vessel_type, speed, depth, gear) via schema extraction and value expansion. TurningTidesFilters enables vessel selection for the Turning Tides dataset with multi-select UI and relatedVesselIds expansion. TurningTidesTags renders and manages filterable vessel tags, with tag removal triggering dataview upsertance. LayerFilters.module.css provides shared styling. All filters persist selections back to dataview config via useDataviewInstancesConnect/upsertDataviewInstance.

## Related

- part of [[activity-dataview-management-system]] — Filtering UI is embedded in ActivityLayerPanel for activity-specific data constraints
- depends on [[workspace-redux-state]] — TurningTidesFilters and TurningTidesTags read selectVesselsDataviews to fetch vessel metadata for filtering options

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
