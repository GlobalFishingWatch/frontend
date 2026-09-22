---
name: Filter Type and Unit Transformation Patterns
slug: filter-type-and-unit-transformation-patterns
type: concept
sources:
  - path: apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx
    hash: 59a96af07c43483b9b8f4e18fd1195b762f3fb4f0521f3fddbfd297ba7121578
  - path: apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx
    hash: 1afc3281ed87e2ce52ee5bd5387636204a9e56908cf2ffbc704bef60c505d9cb
  - path: apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts
    hash: df5774ba3104440bc15b5abc166432f637250a43d06e3ff645b82419c7218883
sources_digest: bca95e61dae8943d77b635b6038b7bd60e47157e95f281bc86bcf4a17ca17121
links: []
generator:
  version: 1
covers:
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L33-L39
  - symbol: DatasetSchemaField
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L41-L166
  - symbol: toDisplay
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L90-L90
  - symbol: LayerSchemaFilterProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L36-L43'
  - symbol: TransformationUnit
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L45-L45'
  - symbol: Transformation
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L49-L53'
  - symbol: getValueByUnit
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L71-L86'
  - symbol: getFilterOperatorOptions
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L88-L99'
  - symbol: getSliderConfigBySchema
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L101-L128
  - symbol: getRangeLimitsBySchema
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L130-L148
  - symbol: getRangeBySchema
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L150-L183
  - symbol: LayerSchemaFilter
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx:L187-L375
  - symbol: showSchemaFilter
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L5-L7
  - symbol: TransformationUnit
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L9-L9
  - symbol: Transformation
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L11-L15
  - symbol: getValueByUnit
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L33-L43
  - symbol: getFilterValueTransform
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L55-L56
  - symbol: getFilterValueById
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L58-L68
  - symbol: getFilterLabelById
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L70-L71
  - symbol: getUnitLabel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L73-L77
  - symbol: getValueLabelByUnit
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L79-L87
  - symbol: getLabelWithUnit
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L89-L101
  - symbol: getSchemaValueRounded
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts:L103-L105
---

<!-- context:generated:start -->

## Summary

Handles conversion between user-facing filter display units (hours, dates) and internal storage/API units (minutes, timestamps). Range filters are stringified in selection objects with potential URL parsing ambiguity. Schema-driven filters compute display labels, slider bounds, and step values from dataset metadata. Filter values are transformed by getValueByUnit and getLabelWithUnit utilities based on schema configuration.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
