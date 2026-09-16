---
name: Color Ramp Configuration
slug: color-ramp-configuration
type: concept
sources:
  - path: libs/deck-layer-composer/src/resolvers/dataviews.ts
    hash: 0d42273406e9a91e1e3b1dcfe757667707437757a57be3d15649496ba0e59c73
  - path: libs/deck-layers/src/config/colorRamps.config.ts
    hash: bbceb6430230f24856c915dcc6d7a9eff17f87a53e3d0c8d3656e2eca15fa239
sources_digest: 49186e858cc2f9197b9259fc193ef6d53de2dee06e3499fe7315445146a6a829
links: []
generator:
  version: 1
covers:
  - symbol: getDatasetsAvailableIntervals
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L54-L55'
  - symbol: getDataviewAvailableIntervals
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L57-L86'
  - symbol: getAvailableIntervalsInDataviews
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L88-L90'
  - symbol: GetMergedHeatmapAnimatedDataviewParams
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L92-L99'
  - symbol: getFourwingsDataviewSublayers
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L101-L151'
  - symbol: getFourwingsDataviewsResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L153-L251'
  - symbol: getFourwingsDataviewsMerged
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L170-L193'
  - symbol: groupContextDataviews
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L253-L263'
  - symbol: getContextDataviewsResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L265-L329'
  - symbol: ResolverGlobalConfig
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L342-L363'
  - symbol: getDataviewsSorted
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L393-L417'
  - symbol: getComparisonMode
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L419-L430'
  - symbol: DataviewGroupKey
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L447-L447'
  - symbol: DataviewsGrouped
    kind: type
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L448-L448'
  - symbol: getDataviewsGrouped
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L450-L462'
  - symbol: getDataviewsResolved
    kind: function
    at: 'libs/deck-layer-composer/src/resolvers/dataviews.ts:L464-L579'
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
---

<!-- context:generated:start -->

## Summary

Centralized color palette system distinguishing single-hue ramps (HEATMAP_COLORS_BY_ID) from multi-hue spectral ramps, with fallback logic when multi-hue ramps aren't supported by datasets.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
