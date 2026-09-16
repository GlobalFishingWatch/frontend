---
name: Filter Compatibility Constraint
slug: filter-compatibility-constraint
type: concept
sources:
  - path: apps/platform/features/_map/workspace/shared/LayerFilters.utils.ts
    hash: cbb5a0c608f8d61dd43efa7fb30da7cd507fe83aba21247ded8142fec6b4289e
  - path: apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx
    hash: 2ab7c67a0175fb07d16d42e2562007d432d6681a2d844d8fdf2ebb1f44b86ebd
sources_digest: aca2f69f7109e7ddb19114b7ad2d82a7c66e366209c5c9e8ea3749ddc4c39dea
links: []
generator:
  version: 1
covers:
  - symbol: OnSelectFilterArgs
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.utils.ts:L10-L14'
  - symbol: cleanDataviewFiltersNotAllowed
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.utils.ts:L24-L52'
  - symbol: LayerFiltersSourceProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L23-L27
  - symbol: LayerFiltersSource
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L29-L86
  - symbol: onSelectSourceClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L45-L59
  - symbol: onRemoveSourceClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx:L61-L68
---

<!-- context:generated:start -->

## Summary

Ensures dataview filter selections remain valid when sources change or user context changes (guest status, vessel group availability). The cleanDataviewFiltersNotAllowed function validates against common filters available across all selected datasets, removing unsupported keys/options to prevent invalid filter combinations. This constraint is particularly important for source selection and guest user transitions.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
