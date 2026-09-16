---
name: Value Transformation and Localization
slug: value-transformation-and-localization
type: concept
sources:
  - path: apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts
    hash: df5774ba3104440bc15b5abc166432f637250a43d06e3ff645b82419c7218883
  - path: apps/platform/features/_map/workspace/shared/MapLegend.tsx
    hash: 02d795116a2c2e7f245638965d172e7f8a158c187d68876648cb7205389b0799
sources_digest: 0b93edda4209c639946e131b6b04ed8742be945a6e169050ce79e3d0a233759d
links:
  - to: map-legend-and-color-ramp-filtering
    relation: uses
    description: >-
      MapLegend applies minVisibleValue/maxVisibleValue transformations to
      update legend brush ranges
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
  - symbol: LegendScale
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L22-L27'
  - symbol: getLegendLabelTranslated
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L29-L55'
  - symbol: MapLegendWrapper
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/MapLegend.tsx:L57-L171'
---

<!-- context:generated:start -->

## Summary

Design pattern for reversible value transformations with directional converters ('in' for external→internal, 'out' for internal→external) combined with getLabel methods for localized unit names. Elevation is intentionally stored inverted as depth (Math.abs and negation), allowing filters to present user-preferred units while maintaining canonical internal values. Applies to time (minutes↔hours) and distance (km) transformations.

## Related

- uses [[map-legend-and-color-ramp-filtering]] — MapLegend applies minVisibleValue/maxVisibleValue transformations to update legend brush ranges

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
