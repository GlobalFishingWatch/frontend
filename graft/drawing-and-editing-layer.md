---
name: Drawing and Editing Layer
slug: drawing-and-editing-layer
type: system
sources:
  - path: libs/deck-layers/src/layers/draw/draw.modes.ts
    hash: 3dfb9b7ab4486c3f6028041c37449c83a7316ecabde4768fab6d44cd5290fbc3
  - path: libs/deck-layers/src/layers/draw/draw.types.ts
    hash: ea69aa5995a8f16537f48c3183e4067cd687a1a2d49aae093abbb75410c4424b
  - path: libs/deck-layers/src/layers/draw/DrawLayer.ts
    hash: ed2775a1334b70c1dc917aedc49ffc42e9ec9f2432c7c3a20800c9baa801ca2a
  - path: libs/deck-layers/src/layers/draw/index.ts
    hash: 1529a67c0ba22136089d5fd2f08805daaf12a4ffd0c5385055b858777285d3e6
sources_digest: ce0dd040c60a3f6b1c9b071ea054b60300bdad0f389da392c14a198ba0264491
links:
  - to: deck-gl-editable-layers-integration
    relation: uses
    description: >-
      Wraps EditableGeoJsonLayer from @deck.gl-community/editable-layers;
      delegates mode handling to custom mode classes (CustomDrawPolygonMode,
      CustomModifyMode, etc.)
  - to: geometry-validation-and-error-handling
    relation: validates
    description: >-
      Uses turf library's kinks function to detect self-intersecting polygons;
      displays error coloring via hasOverlappingFeatures properties and enforces
      minimum 3-point requirement for polygons
  - to: immutable-feature-state-management
    relation: implements
    description: >-
      Manages separate data and tentativeData states for preview-before-commit;
      uses ImmutableFeatureCollection from @deck.gl-community/editable-layers
      for immutable updates
generator:
  version: 1
covers:
  - symbol: Color
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L32-L32'
  - symbol: getFeaturesWithOverlapping
    kind: function
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L61-L70'
  - symbol: getDrawDataParsed
    kind: function
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L72-L77'
  - symbol: DrawLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L83-L90'
  - symbol: DrawFeatureType
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L92-L92'
  - symbol: DrawLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L93-L96'
  - symbol: DrawLayer
    kind: class
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L98-L439'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L115-L124'
  - symbol: _setState
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L140-L145'
  - symbol: getPickingInfo
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L285-L298'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/draw/DrawLayer.ts:L404-L438'
  - symbol: DrawLayerMode
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L13-L18'
  - symbol: CustomDrawPolygonMode
    kind: class
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L20-L50'
  - symbol: handleClick
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L21-L27'
  - symbol: finishDrawing
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L29-L34'
  - symbol: getGuides
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L36-L49'
  - symbol: CustomDrawPointMode
    kind: class
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L51-L59'
  - symbol: handleClick
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L52-L58'
  - symbol: getPickedEditHandles
    kind: function
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L60-L69'
  - symbol: getPickedExistingEditHandle
    kind: function
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L71-L78'
  - symbol: CustomViewMode
    kind: class
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L80-L96'
  - symbol: handleClick
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L81-L95'
  - symbol: hasValidSelection
    kind: function
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L98-L103'
  - symbol: CustomTranslateMode
    kind: class
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L105-L141'
  - symbol: handleStartDragging
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L106-L116'
  - symbol: handleDragging
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L118-L128'
  - symbol: handleStopDragging
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L130-L140'
  - symbol: CustomModifyMode
    kind: class
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L143-L208'
  - symbol: getGuides
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L144-L161'
  - symbol: handleClick
    kind: method
    at: 'libs/deck-layers/src/layers/draw/draw.modes.ts:L163-L207'
  - symbol: DrawFeatureProperties
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L6-L8'
  - symbol: DrawFeature
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L10-L10'
  - symbol: DrawPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L12-L12'
  - symbol: DrawPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L13-L13'
  - symbol: EditHandleType
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L17-L18'
  - symbol: EditHandleFeature
    kind: type
    at: 'libs/deck-layers/src/layers/draw/draw.types.ts:L20-L29'
---

<!-- context:generated:start -->

## Summary

Enables interactive drawing and editing of geographic features (points or polygons) with real-time self-intersection detection, mode switching (draw, view, translate, modify), immutable state management, and validation of drawn geometries. Detects polygon self-intersections using turf's kinks function and displays error coloring on overlaps.

## Related

- uses [[deck-gl-editable-layers-integration]] — Wraps EditableGeoJsonLayer from @deck.gl-community/editable-layers; delegates mode handling to custom mode classes (CustomDrawPolygonMode, CustomModifyMode, etc.)
- validates [[geometry-validation-and-error-handling]] — Uses turf library's kinks function to detect self-intersecting polygons; displays error coloring via hasOverlappingFeatures properties and enforces minimum 3-point requirement for polygons
- implements [[immutable-feature-state-management]] — Manages separate data and tentativeData states for preview-before-commit; uses ImmutableFeatureCollection from @deck.gl-community/editable-layers for immutable updates

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
