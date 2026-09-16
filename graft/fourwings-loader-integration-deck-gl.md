---
name: Fourwings Loader Integration (deck.gl)
slug: fourwings-loader-integration-deck-gl
type: system
sources:
  - path: libs/deck-loaders/src/fourwings/fourwings-clusters-loader.ts
    hash: 2d0bcfb9884d869d494a37a901f34dc36609e24bc55737cae40229e8d5a0c77f
  - path: libs/deck-loaders/src/fourwings/fourwings-loader.ts
    hash: 29b5a7bdfd72686287e6f51ae92092a4199a261373b9a3a9ba419852e2ee08e9
  - path: libs/deck-loaders/src/fourwings/fourwings-vectors-loader.ts
    hash: f6b4771224be8f4994f7823c164c7b292ffcad5646e1b5050e3bfa9d9cdd54da
  - path: libs/deck-loaders/src/fourwings/workers/fourwings-clusters-worker.ts
    hash: e383724c425e99c84e28ac7fde20e8a3b757de926b08a3d9a2982ef8e61e9eff
  - path: libs/deck-loaders/src/fourwings/workers/fourwings-vectors-worker.ts
    hash: 3a237945c4a9499de1f4572f505cf6b9824b5eeb422bebec6cd281c2f42d6c31
  - path: libs/deck-loaders/src/fourwings/workers/fourwings-worker.ts
    hash: 83a771aa72d3cce7305dc6f06e94b215cc240cbe74e7409da940bd509cd8aa97
sources_digest: da82eb3a02966cecea4a139804c24770a736835233d09e5ac6c9b3d3591e02bd
links:
  - to: byte-length-estimation
    relation: uses
    description: >-
      Uses assignFourwingsFeaturesByteLength to estimate memory for Tileset2D
      cache management
  - to: fourwings-cluster-loader
    relation: uses
    description: FourwingsClustersLoader delegates parsing to parseFourwingsClusters
  - to: fourwings-data-types
    relation: implements
    description: >-
      Exposes FourwingsLoaderOptions and related types matching loaders.gl
      contracts
  - to: fourwings-heatmap-loader
    relation: uses
    description: FourwingsLoader delegates parsing to parseFourwings
  - to: fourwings-vector-loader
    relation: uses
    description: FourwingsVectorsLoader delegates parsing to parseFourwingsVectors
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Loader wrapper classes (FourwingsLoader, FourwingsWorkerLoader, FourwingsClustersLoader, FourwingsClustersWorkerLoader, FourwingsVectorsLoader, FourwingsVectorsWorkerLoader) that integrate the Protocol Buffer parsers into the loaders.gl ecosystem. Each loader declares supported file extensions (.pbf), MIME types (application/octet-stream, application/protobuf), and delegates parsing to the corresponding parser module. Worker variants offload parsing to a background thread via @loaders.gl/loader-utils.

## Related

- uses [[byte-length-estimation]] — Uses assignFourwingsFeaturesByteLength to estimate memory for Tileset2D cache management
- uses [[fourwings-cluster-loader]] — FourwingsClustersLoader delegates parsing to parseFourwingsClusters
- implements [[fourwings-data-types]] — Exposes FourwingsLoaderOptions and related types matching loaders.gl contracts
- uses [[fourwings-heatmap-loader]] — FourwingsLoader delegates parsing to parseFourwings
- uses [[fourwings-vector-loader]] — FourwingsVectorsLoader delegates parsing to parseFourwingsVectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
