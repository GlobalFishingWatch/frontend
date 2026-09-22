---
name: User Draw Layer Identification
slug: user-draw-layer-identification
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/user.ts
    hash: 28250fb08d0ab593f34d5b72fd1fbb1dd6a569efba3b7cb169cf672271d7250f
sources_digest: 28c2be0987d252aaef80f04e1f33a032ac9206935310735fc6e29c2317667245
links: []
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

User resolver distinguishes user-drawn geometry via DRAW_DATASET_SOURCE marker and appends cache-busting query parameters using filePath, enabling proper cache invalidation for dynamically drawn features.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
