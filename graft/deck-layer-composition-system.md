---
name: Deck Layer Composition System
slug: deck-layer-composition-system
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/index.ts
    hash: f4f379be9f345382bd668e6b87d20c030a6ede4fb357680b68c8a963d328918a
  - path: libs/deck-layer-composer/src/resolvers/resolvers.ts
    hash: 9c70c44402782024823cd5a8f3bd91dbc78d6b2e6011ddc0d46ae032a6e7c14e
  - path: libs/deck-layer-composer/src/types.ts
    hash: 4609fe52feceff7fe968a82b22b5bd1af13b5fb0300a9cf1e7209057df708c79
  - path: libs/deck-layer-composer/src/types/dataviews.ts
    hash: 4c97d85740b7368ce26b4a4d5ab3788fe56d46955323d2ea2af046b10542fcf1
  - path: libs/deck-layer-composer/src/types/resolvers.ts
    hash: 83700034d4b13bd125e35005ea49fb63be725540f1fe9c2a821e5fdb84390ef8
sources_digest: 5f4fb83262cc1371c233281da1dd3ac9fcbe85b022adf61a650ff1bfd2c3c636
links:
  - to: dataview-resolution-pipeline
    relation: uses
    description: >-
      The resolver system depends on dataview resolution to extract
      layer-specific metadata before delegating to type-specific resolvers
  - to: deck-layers-library
    relation: depends_on
    description: >-
      Instantiates layer classes from @globalfishingwatch/deck-layers based on
      dataview type
  - to: type-specific-layer-resolvers
    relation: uses
    description: >-
      Routes each dataview type to its corresponding resolver function
      (fourwings, basemap, context, vessels, etc.) via cascading dispatch logic
generator:
  version: 1
covers:
  - symbol: DeckLayerClass
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L48-L48'
  - symbol: DeckLayerResolved
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L52-L55'
  - symbol: dataviewToDeckLayerResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L57-L167'
  - symbol: dataviewToDeckLayer
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/resolvers.ts:L169-L175'
  - symbol: DeckLayerLifecycle
    kind: type
    at: 'libs/deck-layer-composer/src/types.ts:L19-L19'
  - symbol: LegendType
    kind: enum
    at: 'libs/deck-layer-composer/src/types.ts:L21-L27'
  - symbol: DeckLegend
    kind: type
    at: 'libs/deck-layer-composer/src/types.ts:L29-L44'
  - symbol: DeckLegendBivariate
    kind: interface
    at: 'libs/deck-layer-composer/src/types.ts:L46-L51'
  - symbol: FourwingsSublayerConfig
    kind: type
    at: 'libs/deck-layer-composer/src/types/dataviews.ts:L9-L24'
  - symbol: ResolvedFourwingsDataviewInstance
    kind: type
    at: 'libs/deck-layer-composer/src/types/dataviews.ts:L26-L31'
  - symbol: ResolvedContextDataviewInstance
    kind: type
    at: 'libs/deck-layer-composer/src/types/dataviews.ts:L33-L39'
  - symbol: ResolvedDataviewInstance
    kind: type
    at: 'libs/deck-layer-composer/src/types/dataviews.ts:L41-L42'
  - symbol: TimeRange
    kind: type
    at: 'libs/deck-layer-composer/src/types/resolvers.ts:L17-L17'
  - symbol: TimeMode
    kind: type
    at: 'libs/deck-layer-composer/src/types/resolvers.ts:L19-L19'
  - symbol: ResolverGlobalConfig
    kind: type
    at: 'libs/deck-layer-composer/src/types/resolvers.ts:L21-L44'
  - symbol: DeckResolverFunction
    kind: type
    at: 'libs/deck-layer-composer/src/types/resolvers.ts:L46-L49'
---

<!-- context:generated:start -->

## Summary

Orchestrates the transformation of abstract dataview configurations into concrete deck.gl layers for geospatial visualization. Acts as the bridge between the API data model and the rendering engine, managing layer instantiation, legend generation, and lifecycle state.

## Related

- uses [[dataview-resolution-pipeline]] — The resolver system depends on dataview resolution to extract layer-specific metadata before delegating to type-specific resolvers
- depends on [[deck-layers-library]] — Instantiates layer classes from @globalfishingwatch/deck-layers based on dataview type
- uses [[type-specific-layer-resolvers]] — Routes each dataview type to its corresponding resolver function (fourwings, basemap, context, vessels, etc.) via cascading dispatch logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
