---
name: Layer Library System
slug: layer-library-system
type: system
sources:
  - path: apps/platform/data/map/layer-library/layers.types.ts
    hash: 9d1ff027e37822fc1ce655747942815151a684bcbfcc31838230ab4c5c4e5219
sources_digest: e04f408936e7e363e7239e26d8ae2dccb45582b7f04124dd98a74758f1af7b0d
links:
  - to: dataview-instance-management
    relation: uses
    description: >-
      Layer library layers are enriched with Dataview objects and instances from
      the API
  - to: localization-and-resource-keys
    relation: depends_on
    description: >-
      LayerLibraryId type is branded on i18n AppResources keys to ensure library
      layer IDs sync with translation resources
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
---

<!-- context:generated:start -->

## Summary

Type-safe configuration and metadata system for pre-defined map layers in the layer library feature. Distinguishes between minimal config (LibraryLayerConfig) and fully-hydrated layers (LibraryLayer with Dataview objects), enabling two-stage initialization where i18n keys ensure sync with translation resources.

## Related

- uses [[dataview-instance-management]] — Layer library layers are enriched with Dataview objects and instances from the API
- depends on [[localization-and-resource-keys]] — LayerLibraryId type is branded on i18n AppResources keys to ensure library layer IDs sync with translation resources

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
