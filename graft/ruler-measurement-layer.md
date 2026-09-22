---
name: Ruler Measurement Layer
slug: ruler-measurement-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/rulers/index.ts
    hash: 9fab4acedfa8dd828d673dd0f06c4bdc73afd4a76c742572b7e371b583dfdbf0
  - path: libs/deck-layers/src/layers/rulers/rulers.types.ts
    hash: 332cb42d43982079b380b52744fe2a37f55428d7987cff647576c7935bc71aa8
  - path: libs/deck-layers/src/layers/rulers/rulers.utils.ts
    hash: d4e64a77446178c5b684500ff97fbf66a101314676b443d522a679d96e44b20e
  - path: libs/deck-layers/src/layers/rulers/RulersLayer.ts
    hash: 0987b644ded4137df111b8244af9d8e341370cfe3cda02680c222564d1dcf280
sources_digest: 01ca77abf7fb4f06dc30a5995bb2bdc19234c8690dab780ac8dcda454dd896bd
links:
  - to: deck-gl-layer-foundation
    relation: uses
    description: >-
      Extends CompositeLayer with GeoJsonLayer and ScatterplotLayer, uses
      PathStyleExtension for dashed line rendering
  - to: shared-picking-and-layer-utilities
    relation: uses
    description: >-
      Uses getLayerGroupOffset for depth ordering and enriches picking via
      getPickingInfo with ruler metadata
generator:
  version: 1
covers:
  - symbol: getRulersLines
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L33-L37'
  - symbol: getRulersLinesLabels
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L39-L43'
  - symbol: RulersLayer
    kind: class
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L45-L119'
  - symbol: getPickingInfo
    kind: method
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L49-L60'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/rulers/RulersLayer.ts:L61-L118'
  - symbol: RulerPointProperties
    kind: type
    at: 'libs/deck-layers/src/layers/rulers/rulers.types.ts:L8-L14'
  - symbol: RulerData
    kind: type
    at: 'libs/deck-layers/src/layers/rulers/rulers.types.ts:L16-L26'
  - symbol: RulersLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/rulers/rulers.types.ts:L28-L31'
  - symbol: RulerFeature
    kind: type
    at: 'libs/deck-layers/src/layers/rulers/rulers.types.ts:L33-L33'
  - symbol: RulerPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/rulers/rulers.types.ts:L34-L34'
  - symbol: RulerPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/rulers/rulers.types.ts:L35-L35'
  - symbol: getRulerCoordsPairs
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L7-L15'
  - symbol: hasRulerStartAndEnd
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L17-L18'
  - symbol: getGreatCircleMultiLine
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L20-L23'
  - symbol: getRulerLengthLabel
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L25-L33'
  - symbol: getRulerStartAndEndPoints
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L35-L45'
  - symbol: getRulerCenterPointWithLabel
    kind: function
    at: 'libs/deck-layers/src/layers/rulers/rulers.utils.ts:L47-L61'
---

<!-- context:generated:start -->

## Summary

Deck.gl composite layer for rendering geodetic ruler measurements with great-circle distance lines, distance labels, and interactive endpoints. Composes GeoJsonLayer for dashed ruler paths with PathStyleExtension and ScatterplotLayer for start/end point markers. Leverages Turf.js for geographic calculations and supports bearing-aware label orientation.

## Related

- uses [[deck-gl-layer-foundation]] — Extends CompositeLayer with GeoJsonLayer and ScatterplotLayer, uses PathStyleExtension for dashed line rendering
- uses [[shared-picking-and-layer-utilities]] — Uses getLayerGroupOffset for depth ordering and enriches picking via getPickingInfo with ruler metadata

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
