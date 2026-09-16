---
name: Layer Type and Configuration System
slug: layer-type-and-configuration-system
type: system
sources:
  - path: libs/deck-layers/src/config/colorRamps.config.ts
    hash: bbceb6430230f24856c915dcc6d7a9eff17f87a53e3d0c8d3656e2eca15fa239
  - path: libs/deck-layers/src/config/colors.config.ts
    hash: 2c086b7f808faa52be7ad193fdd5d47e12e146092ef0a782f4d4f2aadfa3de20
  - path: libs/deck-layers/src/config/index.ts
    hash: fa8db9c58be105586d119f54acc134ab47081ea727b5b770a9f699c6fb33402c
  - path: libs/deck-layers/src/config/layers.config.ts
    hash: 4478ef5be65fe804369698cc430c0ecbe0736f96e69a31b7fe82570f0ea8f6dc
  - path: libs/deck-layers/src/config/sort.config.ts
    hash: 04960a1e51f244a5c2b9023b9a5892bad8162f30d94fe906443ada140fa5741f
sources_digest: 7856ecba5b63d3e99aed07b091b2662539966bd2f9b33e3e4bfcb565874d18a8
links:
  - to: api-integration-and-data-loading
    relation: configures
    description: >-
      layers.config exports PATH_BASENAME and IS_TEST_ENV for sprite asset and
      environment routing
  - to: basemap-layer-suite
    relation: configures
    description: LayerGroup enum and LAYER_GROUP_ORDER control basemap z-order positioning
  - to: fourwings-heatmap-and-vector-layers
    relation: configures
    description: >-
      Color ramps and heatmap constants (FOURWINGS_TILE_SIZE, default color IDs)
      configure heatmap rendering
generator:
  version: 1
covers:
  - symbol: ColorRampId
    kind: type
    at: 'libs/deck-layers/src/config/colorRamps.config.ts:L6-L16'
  - symbol: ColorRampWhiteId
    kind: type
    at: 'libs/deck-layers/src/config/colorRamps.config.ts:L18-L28'
  - symbol: ColorRampsIds
    kind: type
    at: 'libs/deck-layers/src/config/colorRamps.config.ts:L30-L30'
  - symbol: MultiHueColorRampId
    kind: type
    at: 'libs/deck-layers/src/config/colorRamps.config.ts:L56-L56'
  - symbol: AnyColorRampId
    kind: type
    at: 'libs/deck-layers/src/config/colorRamps.config.ts:L57-L57'
  - symbol: getEnv
    kind: function
    at: 'libs/deck-layers/src/config/layers.config.ts:L3-L17'
  - symbol: LayerGroup
    kind: enum
    at: 'libs/deck-layers/src/config/sort.config.ts:L4-L24'
---

<!-- context:generated:start -->

## Summary

Establishes visual hierarchy, color palettes, and runtime configuration for the deck-layers library, including z-order management via LayerGroup enum, color ramp definitions, and environment-aware settings.

## Related

- configures [[api-integration-and-data-loading]] — layers.config exports PATH_BASENAME and IS_TEST_ENV for sprite asset and environment routing
- configures [[basemap-layer-suite]] — LayerGroup enum and LAYER_GROUP_ORDER control basemap z-order positioning
- configures [[fourwings-heatmap-and-vector-layers]] — Color ramps and heatmap constants (FOURWINGS_TILE_SIZE, default color IDs) configure heatmap rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
