---
name: Hardcoded Fixtures for Contextual Layers
slug: hardcoded-fixtures-for-contextual-layers
type: concept
sources:
  - path: apps/track-labeler/src/features/map/map-layers.dataviews.ts
    hash: 6964988de3e6c45f0c8a1b031001e4e47b84f14415e42a95840c31a38bf372a1
sources_digest: ebc65131ed66e169b69854fb79d9af9708e7340a1be79c58b4c803f6601478e4
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Geographic reference layers (basemap, EEZ, MPA, RFMO) are defined as static UrlDataviewInstance fixtures rather than dynamically fetched. The dataviews are cast to Dataset[] via unknown intermediate to work around schema shape mismatches between fixture data and current types. This frozen state suggests the application was historically decoupled from dynamic layer configuration; modern refactors would fetch layer definitions from the API. The design is intentional pragmatism, not an anti-pattern, enabling shipping without backend schema alignment.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
