---
name: Schema-based Filtering
slug: schema-based-filtering
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts
    hash: df5774ba3104440bc15b5abc166432f637250a43d06e3ff645b82419c7218883
sources_digest: 1380e9c00ac1d101b83770b876f5d99ec7e8752d729ba5b948ec15bf594ed586
links:
  - to: value-transformation-and-localization
    relation: implements
    description: >-
      Implements bidirectional value transformation with unit conversion and
      sign inversion patterns
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      Filter transformations persist minVisibleValue/maxVisibleValue via
      upsertDataviewInstance
generator:
  version: 1
covers:
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

LayerSchemaFilter utility module and filter UI components that enable users to filter dataview data by field values (elevation, distance, time). Provides bidirectional value transformations including unit conversions (minutes↔hours, km), sign inversion for elevation↔depth mapping, and localized unit labels. Applies transformDirection='in'/'out' to handle external-to-internal and vice-versa conversions.

## Related

- implements [[value-transformation-and-localization]] — Implements bidirectional value transformation with unit conversion and sign inversion patterns
- uses [[workspace-dataview-instance-management]] — Filter transformations persist minVisibleValue/maxVisibleValue via upsertDataviewInstance

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
