---
name: Layer Filter and Properties Components
slug: layer-filter-and-properties-components
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/layer-properties.utils.ts
    hash: 5eee289cf4ee86ded3e2d177bce899b641922ebc4358dadbc20df7c2c35bc00c
  - path: apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts
    hash: 8da104da9d7f9af60b1a3998bb70b125d27852c10551accb772a27be56ecac6e
  - path: apps/platform/features/_map/workspace/shared/LayerFilters.tsx
    hash: 805d1656f4d25ac15dc45dc332ea687e9b1fcbb14bb07da8325b1f9eb10355cb
  - path: apps/platform/features/_map/workspace/shared/LayerFilters.utils.ts
    hash: cbb5a0c608f8d61dd43efa7fb30da7cd507fe83aba21247ded8142fec6b4289e
  - path: apps/platform/features/_map/workspace/shared/LayerFiltersGap.tsx
    hash: 598b2d5c6ecf308d2e3e41814af350799b549893a3caf96384dcab41e5e33b38
  - path: apps/platform/features/_map/workspace/shared/LayerFiltersSource.tsx
    hash: 2ab7c67a0175fb07d16d42e2562007d432d6681a2d844d8fdf2ebb1f44b86ebd
  - path: apps/platform/features/_map/workspace/shared/LayerProperties.tsx
    hash: c5d99e6b6de894d21e3c61f603732fd17e3d1a29cb0d90363adf032d57021395
  - path: apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx
    hash: 1afc3281ed87e2ce52ee5bd5387636204a9e56908cf2ffbc704bef60c505d9cb
  - path: apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts
    hash: df5774ba3104440bc15b5abc166432f637250a43d06e3ff645b82419c7218883
sources_digest: 231311acd119c119c103fa73ea438c0c51e77749e3fe8780bed0080ffc683525
links:
  - to: dataview-instance-connector
    relation: uses
    description: >-
      All filter and property components call upsertDataviewInstance to apply
      changes to dataview configuration
  - to: filter-compatibility-constraint
    relation: depends_on
    description: >-
      cleanDataviewFiltersNotAllowed and LayerFiltersSource validate and
      sanitize incompatible filter combinations after source changes or guest
      user status changes
  - to: filter-type-and-unit-transformation-patterns
    relation: depends_on
    description: >-
      LayerSchemaFilter and utilities handle unit conversion (minutes to hours),
      range normalization, and filter operation operators (include/exclude)
  - to: workspace-and-dataview-state-selectors
    relation: uses
    description: >-
      Reads visualization mode selectors to determine available filters and
      apply mode downgrade constraints when filters change
generator:
  version: 1
covers:
  - symbol: UseLayerFilterStateParams
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L30-L34'
  - symbol: useLayerFilterState
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L36-L168
  - symbol: UseLayerFilterHandlersParams
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L170-L174
  - symbol: useLayerFilterHandlers
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L176-L345
  - symbol: onSelectHistogramRangeFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L183-L203
  - symbol: onSelectFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L205-L265
  - symbol: onSelectFilterOperationClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L267-L293
  - symbol: onRemoveFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L295-L318
  - symbol: onCleanFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/LayerFilters.hooks.ts:L320-L336
  - symbol: LayerFiltersProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.tsx:L37-L41'
  - symbol: LayerFilters
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.tsx:L47-L154'
  - symbol: OnSelectFilterArgs
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.utils.ts:L10-L14'
  - symbol: cleanDataviewFiltersNotAllowed
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerFilters.utils.ts:L24-L52'
  - symbol: LayerFiltersGapProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerFiltersGap.tsx:L16-L19'
  - symbol: LayerFiltersGap
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerFiltersGap.tsx:L21-L69'
  - symbol: onChange
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerFiltersGap.tsx:L41-L52'
  - symbol: onSelect
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerFiltersGap.tsx:L54-L58'
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
  - symbol: LayerPropertiesOption
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerProperties.tsx:L15-L15'
  - symbol: LayerPropertiesProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerProperties.tsx:L17-L30'
  - symbol: LayerProperties
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerProperties.tsx:L32-L88'
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
  - symbol: isHistogramDataviewSupported
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/layer-properties.utils.ts:L10-L20
---

<!-- context:generated:start -->

## Summary

Renders filter and property panels for map dataviews, enabling users to filter by activity level, encounter type, vessel group, time gaps, and data sources, and to customize layer colors and thickness. Supports multiple filter types (range, enum, boolean), validates filter compatibility across datasets, and enforces visualization mode downgrade constraints when vessel-group filters are applied. Lazy-loads histogram filters and handles guest user restrictions.

## Related

- uses [[dataview-instance-connector]] — All filter and property components call upsertDataviewInstance to apply changes to dataview configuration
- depends on [[filter-compatibility-constraint]] — cleanDataviewFiltersNotAllowed and LayerFiltersSource validate and sanitize incompatible filter combinations after source changes or guest user status changes
- depends on [[filter-type-and-unit-transformation-patterns]] — LayerSchemaFilter and utilities handle unit conversion (minutes to hours), range normalization, and filter operation operators (include/exclude)
- uses [[workspace-and-dataview-state-selectors]] — Reads visualization mode selectors to determine available filters and apply mode downgrade constraints when filters change

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
