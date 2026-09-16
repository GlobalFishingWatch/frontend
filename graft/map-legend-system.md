---
name: Map Legend System
slug: map-legend-system
type: system
sources:
  - path: libs/ui-components/src/map-legend/Bivariate-arrows.tsx
    hash: e4483d62530e23b42490a59cce6911405301a64c317b1b77a7c95abb83e3a8ae
  - path: libs/ui-components/src/map-legend/Bivariate.tsx
    hash: 7dfb8ed7e44967be6d27401a88deea07b5fcaeb733aa0c2166f2d19511e5b834
  - path: libs/ui-components/src/map-legend/ColorRamp.tsx
    hash: 29519aab843cb36ab517dbdfed7bd828cdedfe66a11b205b00591d3b2eead5ff
  - path: libs/ui-components/src/map-legend/ColorRampBrush.tsx
    hash: 253291317523062b06ac4bdb1f2476d3c7005d1e78373ab6aa310f53465c05e1
  - path: libs/ui-components/src/map-legend/index.ts
    hash: 5856f1741d762b841e9886fcdfcb0100ff5d43d2c2eceb8dcb74073aff89c5ca
  - path: libs/ui-components/src/map-legend/map-legend.utils.ts
    hash: 9ac08d1d0363480f8a31e290830775d09d7dec5b9e64f086e207f18a975ea73d
  - path: libs/ui-components/src/map-legend/MapLegend.tsx
    hash: 58f660a5a2ef3d3acbf0fe9a666d9eba31f57647cf6e6a578b27f638f13fe495
  - path: libs/ui-components/src/map-legend/Solid.tsx
    hash: 99166f34aec6b90c66f42220d1f7bb05d9253fd0f85088efc42bf357aa920190
  - path: libs/ui-components/src/map-legend/Symbols.tsx
    hash: 9e9e56278e029889128c1f50becf2e8033fceae384e0045e8691067631f3fc06
  - path: libs/ui-components/src/map-legend/types.ts
    hash: e71122e56e3c0b6703036cdd4cd971e60be4da5325f3e50b39407b9abfbbd3ca
sources_digest: d68dffe359b220d4bd1b2665381059b8d916c51e406bf3b42fd80e6b2f2cf606
links:
  - to: bucket-calculation-for-discrete-mapping
    relation: implements
    description: >-
      BivariateLegend and ColorRamp use getBucketIndex to classify numeric
      values into discrete legend cell ranges, with 0 reserved as sentinel for
      omitted features
  - to: d3-scale-geojson-integration
    relation: depends_on
    description: >-
      ColorRamp and ColorRampBrush use d3-scale for domain-to-percentage
      mapping, Bivariate uses bucket indexing
  - to: icon-system
    relation: uses
    description: >-
      Symbols and Bivariate legends display Icon components for symbol-based and
      bivariate mapping
  - to: input-components
    relation: uses
    description: >-
      ColorRampBrush uses InputText for precise numeric range input and popover
      fine-tuning
  - to: layout-container-components
    relation: uses
    description: ColorRampBrush uses Popover for accessible numeric value editing
  - to: legend-type-dispatch-pattern
    relation: implements
    description: >-
      MapLegend routes to type-specific implementations via discriminated union
      on UILegend.type; uses exhaustive if-chain for type narrowing
  - to: number-formatting-rounding-convention
    relation: implements
    description: >-
      map-legend.utils implements specialized formatting for legend values with
      abbreviation, decimal control, and divergent scale polarity indicators
  - to: tooltip-system
    relation: uses
    description: ColorRampBrush uses Tooltip for interactive hints on drag handles
generator:
  version: 1
covers:
  - symbol: BivariateArrows
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate-arrows.tsx:L3-L50'
  - symbol: BivariateLegendProps
    kind: type
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L11-L16'
  - symbol: getBucketIndex
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L36-L50'
  - symbol: getBivariateValue
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L52-L80'
  - symbol: BivariateRect
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L85-L104'
  - symbol: BivariateLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/Bivariate.tsx:L121-L203'
  - symbol: PercentScale
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L18-L18'
  - symbol: toPercent
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L20-L23'
  - symbol: ColorRampLegendProps
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L25-L32'
  - symbol: ColorRampLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L34-L264'
  - symbol: getValueLabel
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRamp.tsx:L168-L178'
  - symbol: ColorRampBrushRange
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L12-L12'
  - symbol: ColorRampBrushConfig
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L14-L20'
  - symbol: ColorRampBrushProps
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L22-L27'
  - symbol: Bound
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L29-L29'
  - symbol: Drag
    kind: type
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L31-L38'
  - symbol: clamp
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L42-L42'
  - symbol: sorted
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L44-L45'
  - symbol: ColorRampBrush
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L47-L290'
  - symbol: percentAt
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L72-L75'
  - symbol: commit
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L77-L99'
  - symbol: boundValue
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L81-L89'
  - symbol: onTrackPointerDown
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L101-L116'
  - symbol: onHandlePointerDown
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L118-L125'
  - symbol: onPointerMove
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L127-L134'
  - symbol: onPointerUp
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L136-L151'
  - symbol: onHandleKeyDown
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L153-L162'
  - symbol: commitBound
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L164-L175'
  - symbol: closeAndCommit
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L177-L181'
  - symbol: isLowerHandle
    kind: function
    at: 'libs/ui-components/src/map-legend/ColorRampBrush.tsx:L184-L187'
  - symbol: MapLegendProps
    kind: interface
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L19-L26'
  - symbol: MapLegendsProps
    kind: interface
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L28-L30'
  - symbol: MapLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L32-L70'
  - symbol: MapLegends
    kind: function
    at: 'libs/ui-components/src/map-legend/MapLegend.tsx:L72-L86'
  - symbol: SolidLegendProps
    kind: type
    at: 'libs/ui-components/src/map-legend/Solid.tsx:L8-L11'
  - symbol: SolidLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/Solid.tsx:L13-L21'
  - symbol: SymbolsLegendProps
    kind: type
    at: 'libs/ui-components/src/map-legend/Symbols.tsx:L11-L14'
  - symbol: SymbolsLegend
    kind: function
    at: 'libs/ui-components/src/map-legend/Symbols.tsx:L16-L51'
  - symbol: parseLegendNumber
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L6-L11'
  - symbol: roundLegendDecimals
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L13-L18'
  - symbol: roundLegendNumber
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L20-L22'
  - symbol: FormatLegendValueParams
    kind: type
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L24-L31'
  - symbol: formatLegendValue
    kind: function
    at: 'libs/ui-components/src/map-legend/map-legend.utils.ts:L32-L63'
  - symbol: LegendType
    kind: enum
    at: 'libs/ui-components/src/map-legend/types.ts:L3-L9'
  - symbol: BaseLegend
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L11-L19'
  - symbol: UILegendSolid
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L21-L25'
  - symbol: UILegendSymbols
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L27-L33'
  - symbol: UILegendColorRamp
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L35-L41'
  - symbol: UILegendBivariate
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L43-L48'
  - symbol: UILegend
    kind: type
    at: 'libs/ui-components/src/map-legend/types.ts:L50-L50'
---

<!-- context:generated:start -->

## Summary

Comprehensive cartographic legend rendering system supporting five distinct visualization types (ColorRamp, ColorRampDiscrete, Solid, Symbols, Bivariate) with interactive range brushing, continuous and discrete color scales, and bivariate data encoding. Uses discriminated unions for type-safe legend variant dispatch and d3-scale for value-to-position mapping.

## Related

- implements [[bucket-calculation-for-discrete-mapping]] — BivariateLegend and ColorRamp use getBucketIndex to classify numeric values into discrete legend cell ranges, with 0 reserved as sentinel for omitted features
- depends on [[d3-scale-geojson-integration]] — ColorRamp and ColorRampBrush use d3-scale for domain-to-percentage mapping, Bivariate uses bucket indexing
- uses [[icon-system]] — Symbols and Bivariate legends display Icon components for symbol-based and bivariate mapping
- uses [[input-components]] — ColorRampBrush uses InputText for precise numeric range input and popover fine-tuning
- uses [[layout-container-components]] — ColorRampBrush uses Popover for accessible numeric value editing
- implements [[legend-type-dispatch-pattern]] — MapLegend routes to type-specific implementations via discriminated union on UILegend.type; uses exhaustive if-chain for type narrowing
- implements [[number-formatting-rounding-convention]] — map-legend.utils implements specialized formatting for legend values with abbreviation, decimal control, and divergent scale polarity indicators
- uses [[tooltip-system]] — ColorRampBrush uses Tooltip for interactive hints on drag handles

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
