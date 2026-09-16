---
name: Deck.gl Editable Layers Integration
slug: deck-gl-editable-layers-integration
type: concept
sources:
  - path: libs/deck-layers/src/layers/draw/draw.modes.ts
    hash: 3dfb9b7ab4486c3f6028041c37449c83a7316ecabde4768fab6d44cd5290fbc3
  - path: libs/deck-layers/src/layers/draw/DrawLayer.ts
    hash: ed2775a1334b70c1dc917aedc49ffc42e9ec9f2432c7c3a20800c9baa801ca2a
sources_digest: 0e962ca082f828716b57d6de13fc35b7c7b0bbc269e7aa06e5606a84905c9c57
links:
  - to: geometry-validation-and-error-handling
    relation: validates
    description: >-
      Modes validate selections via hasValidSelection() and filter incomplete
      guide features during drawing
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
---

<!-- context:generated:start -->

## Summary

Custom extension of @deck.gl-community/editable-layers with application-specific mode behaviors. Custom modes (CustomDrawPolygonMode, CustomModifyMode, etc.) override handlers to add event prevention, validation, and error resilience while dispatching custom edit events (customUpdateSelectedFeaturesIndexes, customUpdateSelectedPositionIndexes, customClickOutside). Provides selection query helpers (getPickedEditHandles) for downstream logic.

## Related

- validates [[geometry-validation-and-error-handling]] — Modes validate selections via hasValidSelection() and filter incomplete guide features during drawing

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
