---
name: User Layer Resolution
slug: user-layer-resolution
type: system
sources:
  - path: libs/deck-layer-composer/src/resolvers/user.ts
    hash: 28250fb08d0ab593f34d5b72fd1fbb1dd6a569efba3b7cb169cf672271d7250f
sources_digest: 28c2be0987d252aaef80f04e1f33a032ac9206935310735fc6e29c2317667245
links:
  - to: dataset-client
    relation: uses
    description: >-
      Uses getDatasetConfigurationProperty to extract visual properties (radius
      ranges, color steps) from dataset metadata
  - to: deck-layers-library
    relation: depends_on
    description: >-
      Produces DeckLayerProps and BaseUserLayerProps types compatible with
      deck-layers user layer classes
generator:
  version: 1
covers:
  - symbol: getUserContextTimeFilterProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L24-L59'
  - symbol: getUserPolygonColorProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L61-L82'
  - symbol: getUserCircleProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L84-L130'
  - symbol: resolveDeckUserLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L132-L226'
  - symbol: resolveDeckUserContextLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L228-L238'
  - symbol: resolveDeckUserPointsLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L240-L251'
  - symbol: resolveDeckUserTracksLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/user.ts:L253-L264'
---

<!-- context:generated:start -->

## Summary

Resolves configuration for user-drawn and user-context geospatial layers (polygons, points, tracks), extracting dataset properties, applying time filtering, and computing visual styling based on dataset configuration.

## Related

- uses [[dataset-client]] — Uses getDatasetConfigurationProperty to extract visual properties (radius ranges, color steps) from dataset metadata
- depends on [[deck-layers-library]] — Produces DeckLayerProps and BaseUserLayerProps types compatible with deck-layers user layer classes

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
