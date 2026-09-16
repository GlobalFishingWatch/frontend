---
name: Filter Enum Field Size Constraints
slug: filter-enum-field-size-constraints
type: concept
sources:
  - path: apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx
    hash: 44fb021ae09c0e5998db5ba705db09cb4474182f21c8325355ff03338956176e
sources_digest: 3769b6894c76022789cb83a282bc4e51d2d0fa14039227632a9f873c1ac78f29
links: []
generator:
  version: 1
covers:
  - symbol: useDatasetMetadata
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L21-L69
  - symbol: FieldOption
    kind: type
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L72-L72
  - symbol: useDatasetMetadataOptions
    kind: function
    at: >-
      apps/platform/features/_map/datasets/upload/datasets-upload.hooks.tsx:L73-L177
---

<!-- context:generated:start -->

## Summary

During upload, the useDatasetMetadataOptions hook enforces MAX_FILTERS_ENUM_VALUES and MAX_FILTERS_ENUM_VALUES_EXCEEDED limits on enumerated field options. When limits are exceeded, a tooltip is shown and field selection is disabled, preventing creation of datasets with unmanageable filter cardinality. This constraint optimizes both UI rendering and filter performance in the map interaction layer.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
