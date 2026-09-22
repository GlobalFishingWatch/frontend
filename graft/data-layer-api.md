---
name: Data Layer & API
slug: data-layer-api
type: system
sources:
  - path: apps/platform/features/data/areas/areas.hooks.ts
    hash: b0a36123eb1d63e228594e63b9eeb4e02bef2c7fbb3303dd70b08e76a73671ac
  - path: apps/platform/features/data/areas/areas.slice.ts
    hash: bf0c48b82c6c4a430ae8c064098d8f5ef60df01b0e2456189d30331651e6a565
  - path: apps/platform/features/data/resources/resources.selectors.thinning.ts
    hash: f8ff777a5538a07f6da04caaceabd0b0e046b9a52ca6f7944032aafced41b90e
  - path: apps/platform/features/data/resources/resources.utils.ts
    hash: cbe1db1686bb21247e959ffaef4fb3205590a4f4505563325cbb64b4aa363a8b
sources_digest: 3ccfad5b01e61fa1310c7762c738af1bc7116d6c41229e9f4a7a90bd78362b65
links:
  - to: debug-tools
    relation: uses
    description: >-
      resources.selectors.thinning integrates debug options (selectDebugActive)
      to control track thinning aggressiveness
  - to: workspace-map-data
    relation: produces
    description: >-
      Provides area geometries, bounds, and datasets that populate map workspace
      state
generator:
  version: 1
covers:
  - symbol: useFetchContextDatasetAreas
    kind: function
    at: 'apps/platform/features/data/areas/areas.hooks.ts:L8-L19'
  - symbol: parseFeatureBbox
    kind: function
    at: 'apps/platform/features/data/areas/areas.slice.ts:L20-L29'
  - symbol: DrawnDatasetGeometry
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L31-L31'
  - symbol: DatasetArea
    kind: interface
    at: 'apps/platform/features/data/areas/areas.slice.ts:L33-L37'
  - symbol: DatasetAreaList
    kind: interface
    at: 'apps/platform/features/data/areas/areas.slice.ts:L39-L42'
  - symbol: AreaGeometry
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L44-L44'
  - symbol: Area
    kind: interface
    at: 'apps/platform/features/data/areas/areas.slice.ts:L45-L52'
  - symbol: DatasetAreaDetail
    kind: interface
    at: 'apps/platform/features/data/areas/areas.slice.ts:L53-L56'
  - symbol: DatasetAreas
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L63-L66'
  - symbol: AreasState
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L67-L67'
  - symbol: ensureDatasetAreas
    kind: function
    at: 'apps/platform/features/data/areas/areas.slice.ts:L71-L81'
  - symbol: AreaKeyId
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L83-L83'
  - symbol: AreaKeys
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L84-L84'
  - symbol: FetchAreaDetailThunkParam
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L85-L90'
  - symbol: fetchAreaDetail
    kind: function
    at: 'apps/platform/features/data/areas/areas.slice.ts:L92-L172'
  - symbol: FetchDatasetAreasThunkParam
    kind: type
    at: 'apps/platform/features/data/areas/areas.slice.ts:L276-L280'
  - symbol: selectAreas
    kind: function
    at: 'apps/platform/features/data/areas/areas.slice.ts:L398-L398'
  - symbol: infoDatasetConfigsCallback
    kind: function
    at: 'apps/platform/features/data/resources/resources.utils.ts:L7-L20'
---

<!-- context:generated:start -->

## Summary

Redux async thunks and selectors for fetching datasets, areas, and resources from the Global Fishing Watch API. Normalizes state storage, implements intelligent caching with AsyncReducer utilities, and provides specialized geometry handling (antimeridian wrapping, simplification). Supports user-drawn areas and context layers with multi-dataset merging.

## Related

- uses [[debug-tools]] — resources.selectors.thinning integrates debug options (selectDebugActive) to control track thinning aggressiveness
- produces [[workspace-map-data]] — Provides area geometries, bounds, and datasets that populate map workspace state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
