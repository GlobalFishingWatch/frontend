---
name: ocean-areas datasets
slug: ocean-areas-datasets
type: system
sources:
  - path: libs/ocean-areas/src/data/eezs.ts
    hash: a346d4c977273bd94ae18f1af0de18bf6731b6077a96f7e1c61b4e4004de3368
  - path: libs/ocean-areas/src/data/fao.ts
    hash: 85baec2cc2c8196b87600650f6833c89c8854229251dc2b62abb0da07be3a23d
  - path: libs/ocean-areas/src/data/index.ts
    hash: 26de4ce1fe8f5befaa447214daef80ee3848aaa100967e26194b9e39c8e0ae05
  - path: libs/ocean-areas/src/data/mpas.ts
    hash: 609f797b679b88fa4398c01766dd79756c687628d8085fe1b5d910b4e6ba58d9
  - path: libs/ocean-areas/src/data/ports.ts
    hash: 94713c5feef36284f852e6dcb9ea12807a11f1fcac3d21e2411ac87dfdad354c
  - path: libs/ocean-areas/src/data/rfmos.ts
    hash: 3c1e1a76f4f63fe9f0641727a20bc921c31f1c79d662f17133b336104b7b55d2
sources_digest: cc594e769a0a666e8a96622f73137f2ab0ce808781b659f2262ef0e4f2cbea3e
links:
  - to: ocean-areas-geospatial-querying
    relation: part_of
    description: >-
      Data collections are lazy-loaded and queried by searchOceanAreas,
      getOverlappingAreas, getAreasByDistance, getOceanAreaName
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Aggregates five maritime boundary datasets (EEZs, MPAs, FAO fishing areas, RFMOs, ports) as typed GeoJSON FeatureCollections. Each dataset wraps raw JSON files with OceanAreaProperties type annotations. Data module provides centralized index that merges all features into a single FeatureCollection.

## Related

- part of [[ocean-areas-geospatial-querying]] — Data collections are lazy-loaded and queried by searchOceanAreas, getOverlappingAreas, getAreasByDistance, getOceanAreaName

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
