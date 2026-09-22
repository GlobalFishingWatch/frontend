---
name: D3 Scale & GeoJSON Integration
slug: d3-scale-geojson-integration
type: concept
sources:
  - path: libs/ui-components/src/map-legend/ColorRamp.tsx
    hash: 29519aab843cb36ab517dbdfed7bd828cdedfe66a11b205b00591d3b2eead5ff
  - path: libs/ui-components/src/map-legend/ColorRampBrush.tsx
    hash: 253291317523062b06ac4bdb1f2476d3c7005d1e78373ab6aa310f53465c05e1
  - path: libs/ui-components/src/miniglobe/Miniglobe.tsx
    hash: 0f9816ecb2246a086b20ef87ffed059a19a2bea826328949f4680448fd52941b
  - path: libs/ui-components/src/slider/Slider.tsx
    hash: fb71493b806647ea91976a8e47dfad196c4d0ccada96ffe266ca616d7c42a67c
sources_digest: 392b68b679edc961cf5d94d72d03b60fc77caa1bf511d9d28e5a4ee833450bf1
links:
  - to: input-components
    relation: implements
    description: Slider uses d3-scale for non-linear step mapping
  - to: map-globe-visualization
    relation: implements
    description: >-
      Miniglobe uses d3-geo and topojson-client for geographic projection and
      topology rendering
  - to: map-legend-system
    relation: implements
    description: ColorRamp and ColorRampBrush use d3-scale for domain-to-percentage mapping
generator:
  version: 1
covers:
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
  - symbol: MiniglobeBounds
    kind: interface
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L10-L15'
  - symbol: MiniglobeCenter
    kind: interface
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L17-L20'
  - symbol: densifyEdge
    kind: function
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L23-L27'
  - symbol: MiniglobeProps
    kind: interface
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L37-L43'
  - symbol: MiniGlobe
    kind: function
    at: 'libs/ui-components/src/miniglobe/Miniglobe.tsx:L45-L136'
  - symbol: SliderThumbsSize
    kind: type
    at: 'libs/ui-components/src/slider/Slider.tsx:L10-L10'
  - symbol: SliderConfig
    kind: type
    at: 'libs/ui-components/src/slider/Slider.tsx:L11-L16'
  - symbol: SliderProps
    kind: interface
    at: 'libs/ui-components/src/slider/Slider.tsx:L17-L30'
  - symbol: Slider
    kind: function
    at: 'libs/ui-components/src/slider/Slider.tsx:L48-L142'
---

<!-- context:generated:start -->

## Summary

Shared use of d3-scale and d3-geo across map legend and globe visualization components for domain-to-view mapping and geographic projections. ColorRamp and ColorRampBrush use scaleLinear to map domain values to percentages for positioning labels and interactive brushes, Slider uses scaleLinear to decouple UI ranges from arbitrary step values (enabling non-linear stepping), and Miniglobe uses geoOrthographic with topojson-client to deserialize Natural Earth topology and render geographic features. This library choice enables sophisticated cartographic and numeric scaling without custom math; a side effect is hard-coded dependencies on d3 (which has large bundle impact) and specific topology data formats.

## Related

- implements [[input-components]] — Slider uses d3-scale for non-linear step mapping
- implements [[map-globe-visualization]] — Miniglobe uses d3-geo and topojson-client for geographic projection and topology rendering
- implements [[map-legend-system]] — ColorRamp and ColorRampBrush use d3-scale for domain-to-percentage mapping

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
