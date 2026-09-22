---
name: Dataview Instance Management
slug: dataview-instance-management
type: concept
sources:
  - path: apps/platform/data/map/layer-library/layers.types.ts
    hash: 9d1ff027e37822fc1ce655747942815151a684bcbfcc31838230ab4c5c4e5219
  - path: apps/platform/features/_map/bigquery/bigquery.hooks.ts
    hash: 5cd4165760cb63c7c0dcedc9ba5b406a5a102f8764b7f8e88081d29a9ad2274b
  - path: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx
    hash: 265ed5719848d8e41e5a1d7b82c8d0ecefb388a15e65febb56bb160f450c44af
sources_digest: e103b94f26f6e3f013db26748de75c1dbc9ff0c1ff823c90e6104f6e6519936c
links:
  - to: bigquery-modal-and-custom-dataset-creation
    relation: depends_on
    description: >-
      BigQuery modal creates dataview instances via
      getBigQuery4WingsDataviewInstance/getBigQueryEventsDataviewInstance
      factories
  - to: redux-state-management
    relation: uses
    description: >-
      Dataviews are registered via addNewDataviewInstances dispatch or fetched
      via selectDataviewInstancesResolved selector
generator:
  version: 1
covers:
  - symbol: LayerLibraryId
    kind: type
    at: 'apps/platform/data/map/layer-library/layers.types.ts:L14-L14'
  - symbol: LibraryLayerConfig
    kind: type
    at: 'apps/platform/data/map/layer-library/layers.types.ts:L15-L20'
  - symbol: LibraryLayer
    kind: type
    at: 'apps/platform/data/map/layer-library/layers.types.ts:L22-L27'
  - symbol: useBigQueryModal
    kind: function
    at: 'apps/platform/features/_map/bigquery/bigquery.hooks.ts:L25-L89'
  - symbol: onRunCostClick
    kind: function
    at: 'apps/platform/features/_map/bigquery/bigquery.hooks.ts:L37-L49'
  - symbol: onCreateClick
    kind: function
    at: 'apps/platform/features/_map/bigquery/bigquery.hooks.ts:L51-L72'
  - symbol: DatasetInfoContainer
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L35-L146
  - symbol: updateSubsectionId
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L110-L113
---

<!-- context:generated:start -->

## Summary

Central pattern for instantiating and managing dataview objects from API definitions, datasetsConfig, and related datasets. Dataviews serve as the primary abstraction for rendering map layers, with instance factories creating mode-specific variants (4wings, events, track) and registration through Redux dispatch.

## Related

- depends on [[bigquery-modal-and-custom-dataset-creation]] — BigQuery modal creates dataview instances via getBigQuery4WingsDataviewInstance/getBigQueryEventsDataviewInstance factories
- uses [[redux-state-management]] — Dataviews are registered via addNewDataviewInstances dispatch or fetched via selectDataviewInstancesResolved selector

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
