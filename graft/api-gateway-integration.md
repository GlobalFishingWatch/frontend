---
name: API Gateway Integration
slug: api-gateway-integration
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/vessels.ts
    hash: ec5ac48a92ff51388ce4aaa9c8380d939f917c4e735eb7676b7782c5f81b32ed
  - path: libs/deck-layers/src/layers/_shared/api.ts
    hash: d30bafae17dd71a4e6995be90b410596f7a5a4c8d4e1beabfdbec738da418ea6
sources_digest: 5cad0c37b266b4a027f4c41bcbdef4f3129b5a3393a85ec119bc9c10b00d8c1e
links: []
generator:
  version: 1
covers:
  - symbol: resolveDeckVesselLayerProps
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/vessels.ts:L14-L98'
  - symbol: FetchWithGFWAPIContext
    kind: type
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L17-L25'
  - symbol: getFetchLoadOptions
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L27-L36'
  - symbol: isSpriteUrl
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L41-L43'
  - symbol: getSpriteFilename
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L45-L48'
  - symbol: resolveLocalSpriteUrl
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L50-L67'
  - symbol: fetchLocalSprite
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L69-L76'
  - symbol: ResponseHeaderOptions
    kind: type
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L78-L78'
  - symbol: getResponseHeader
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L82-L95'
  - symbol: fetchWithGFWAPI
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.ts:L97-L137'
---

<!-- context:generated:start -->

## Summary

External dependency from @globalfishingwatch/api-client that provides endpoints for vessel tracks, events, and thinning configuration needed by vessel and track layer resolvers.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
