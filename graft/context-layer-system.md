---
name: Context Layer System
slug: context-layer-system
type: system
sources:
  - path: libs/deck-layers/src/layers/context/context.config.ts
    hash: a5aa3ed0ae950edac30d24d84a7c660195bae91d77b1c9d7f5765856c98bcae8
  - path: libs/deck-layers/src/layers/context/context.types.ts
    hash: deb35f707652c02c7bc1fae64184a1451b2f117ec18787c3b4c17584af1a930e
  - path: libs/deck-layers/src/layers/context/context.utils.ts
    hash: 1fb085368f2c513be2411ff98c59eed542893fa75beba1aaada83d3d7a9f2699
  - path: libs/deck-layers/src/layers/context/ContextLayer.ts
    hash: 779dbb956bddd9bf461ae9e0423523799f62641defb7bb8d3f5b3afe67b385a2
  - path: libs/deck-layers/src/layers/context/index.ts
    hash: 47e779f785f4f784ab8849464ef40e3b7675951320d1d2851ee07600037645d2
sources_digest: 2cbbd3728ce012004c05015c72933837b45c4bc134eea23f456bbc533f36a588
links:
  - to: deck-gl-core-integration
    relation: depends_on
    description: >-
      Depends on deck.gl DataFilterExtension, PathStyleExtension, and geo-layers
      TileLayer; uses RFMO_LINKS lookup for external URL mapping
  - to: tile-data-access-patterns
    relation: implements
    description: >-
      Implements getSelectedTilesFeatures for retrieving all features from tiles
      in viewport; converts tile coordinates to WGS84 using
      transformTileCoordsToWGS84
  - to: vector-tile-layer-infrastructure
    relation: uses
    description: >-
      Extends TileLayer to support both MVT and PMTiles formats; uses
      GeoJsonLayer instances for multi-layer sublayer rendering
generator:
  version: 1
covers:
  - symbol: _ContextLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L51-L51'
  - symbol: ContextLayerState
    kind: type
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L53-L55'
  - symbol: ContextLayer
    kind: class
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L63-L407'
  - symbol: initializeState
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L71-L76'
  - symbol: filtersHash
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L78-L86'
  - symbol: cacheHash
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L88-L90'
  - symbol: _getHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L92-L94'
  - symbol: getHighlightLineWidth
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L96-L114'
  - symbol: getFillColor
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L116-L126'
  - symbol: getDashArray
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L128-L130'
  - symbol: getRenderedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L176-L212'
  - symbol: renderLayers
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L214-L399'
  - symbol: setHighlightedFeatures
    kind: method
    at: 'libs/deck-layers/src/layers/context/ContextLayer.ts:L401-L406'
  - symbol: ContextSublayerCallbackParams
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L9-L12'
  - symbol: ContextLayerId
    kind: enum
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L14-L27'
  - symbol: ContextLayerConfigFilter
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L29-L29'
  - symbol: ContextSubLayerConfig
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L30-L40'
  - symbol: ContextLayerConfig
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L41-L50'
  - symbol: ContextLayerProps
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L52-L56'
  - symbol: ContextFeatureBaseProperties
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L58-L66'
  - symbol: ContextFeatureProperties
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L68-L70'
  - symbol: ContextFeature
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L72-L75'
  - symbol: ContextPickingObject
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L77-L77'
  - symbol: ContextPickingInfo
    kind: type
    at: 'libs/deck-layers/src/layers/context/context.types.ts:L79-L79'
  - symbol: getContextId
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L21-L32'
  - symbol: getContextFiltersHash
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L34-L38'
  - symbol: getContextFilterOperatorsHash
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L40-L46'
  - symbol: getValidSublayerFilters
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L48-L56'
  - symbol: hasSublayerFilters
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L58-L60'
  - symbol: supportDataFilterExtension
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L67-L76'
  - symbol: getContextLink
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L106-L140'
  - symbol: getSelectedTilesFeatures
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L149-L176'
  - symbol: mergePickedFeatures
    kind: function
    at: 'libs/deck-layers/src/layers/context/context.utils.ts:L178-L228'
---

<!-- context:generated:start -->

## Summary

Renders geographic context features (EEZ boundaries, maritime zones, MPAs) from MVT and PMTiles vector tiles with multi-layer sublayer rendering (fill highlights, boundary lines, dash patterns), support for property-based filtering via DataFilterExtension, and coordinate transformation to handle antimeridian wrapping. Maintains cacheHash combining id, filters, and load state for optimization.

## Related

- depends on [[deck-gl-core-integration]] — Depends on deck.gl DataFilterExtension, PathStyleExtension, and geo-layers TileLayer; uses RFMO_LINKS lookup for external URL mapping
- implements [[tile-data-access-patterns]] — Implements getSelectedTilesFeatures for retrieving all features from tiles in viewport; converts tile coordinates to WGS84 using transformTileCoordsToWGS84
- uses [[vector-tile-layer-infrastructure]] — Extends TileLayer to support both MVT and PMTiles formats; uses GeoJsonLayer instances for multi-layer sublayer rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
