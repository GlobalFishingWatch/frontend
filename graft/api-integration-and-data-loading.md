---
name: API Integration and Data Loading
slug: api-integration-and-data-loading
type: system
sources:
  - path: libs/deck-layers/src/layers/_shared/api.test.ts
    hash: e89f8b35dcf7fbe9ce16bc676f86b8b64c6560280ee4f0179e79cb5d67d5a77c
  - path: libs/deck-layers/src/layers/_shared/api.ts
    hash: d30bafae17dd71a4e6995be90b410596f7a5a4c8d4e1beabfdbec738da418ea6
sources_digest: bc2cdcca87b16d1e0788a9ce24321d4e3d7292ee156aac784c27ca600df64b90
links:
  - to: layer-type-and-configuration-system
    relation: uses
    description: >-
      Uses getEnv from layer config to resolve sprite paths and detect test
      environments
  - to: tile-coordinate-system
    relation: produces
    description: >-
      Parses and loads tile data that is then transformed by tile coordinate
      utilities
generator:
  version: 1
covers:
  - symbol: trackResponse
    kind: function
    at: 'libs/deck-layers/src/layers/_shared/api.test.ts:L25-L29'
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

Handles authenticated API requests, sprite asset resolution, MVT/PMTiles parsing, and specialized vessel track data loading with timestamp metadata extraction from response headers.

## Related

- uses [[layer-type-and-configuration-system]] — Uses getEnv from layer config to resolve sprite paths and detect test environments
- produces [[tile-coordinate-system]] — Parses and loads tile data that is then transformed by tile coordinate utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
