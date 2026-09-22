---
name: Type System and Layer Contracts
slug: type-system-and-layer-contracts
type: file
sources:
  - path: libs/deck-layers/src/types.ts
    hash: 36f0183f3cf3038ba1db5e87fdd594f8acc0f3fc6d0f3d051cd12107e370f284
sources_digest: f810ab8b4ecb7ab3184c9275d66ee25e8b18a25814b0e7639064803e085fb2c0
links:
  - to: interactive-picking-and-enrichment
    relation: implements
    description: >-
      Provides polymorphic picking type system that all layers must conform to
      via DeckLayerPickingObject union
  - to: user-layer-system
    relation: implements
    description: >-
      Defines user layer sublayers in AnyDeckLayer and provides picking type
      exports
  - to: vessel-layer-system
    relation: implements
    description: >-
      Defines VesselLayer discriminator in AnyDeckLayer union and re-exports
      vessel picking types
generator:
  version: 1
covers:
  - symbol: DeckLayerCategory
    kind: type
    at: 'libs/deck-layers/src/types.ts:L33-L33'
  - symbol: DeckLayerSubcategory
    kind: type
    at: 'libs/deck-layers/src/types.ts:L34-L34'
  - symbol: DeckLayerProps
    kind: type
    at: 'libs/deck-layers/src/types.ts:L36-L40'
  - symbol: DeckPickingObject
    kind: type
    at: 'libs/deck-layers/src/types.ts:L42-L52'
  - symbol: AnyDeckLayer
    kind: type
    at: 'libs/deck-layers/src/types.ts:L54-L62'
  - symbol: LayerWithIndependentSublayersLoadState
    kind: type
    at: 'libs/deck-layers/src/types.ts:L64-L64'
  - symbol: DeckLayerPickingObject
    kind: type
    at: 'libs/deck-layers/src/types.ts:L66-L78'
  - symbol: DeckLayerInteractionPickingInfo
    kind: type
    at: 'libs/deck-layers/src/types.ts:L80-L87'
---

<!-- context:generated:start -->

## Summary

Central TypeScript type definitions establishing contracts for all custom deck.gl layers in the library. Defines DeckLayerProps base (id, category, optional subcategory), DeckLayerCategory enum (basemap, context, fourwings, vessel, rulers, pmtiles, tilesBoundaries), discriminated union AnyDeckLayer covering all layer variants, and polymorphic picking types (DeckPickingObject, DeckLayerPickingObject, DeckLayerInteractionPickingInfo) that force type-safe handling of layer-specific picking results. Re-exports granular picking types from individual layer modules enabling downstream consumers to pattern-match on picking event payloads.

## Related

- implements [[interactive-picking-and-enrichment]] — Provides polymorphic picking type system that all layers must conform to via DeckLayerPickingObject union
- implements [[user-layer-system]] — Defines user layer sublayers in AnyDeckLayer and provides picking type exports
- implements [[vessel-layer-system]] — Defines VesselLayer discriminator in AnyDeckLayer union and re-exports vessel picking types

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
