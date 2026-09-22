---
name: Deck Layer Resource Fetching
slug: deck-layer-resource-fetching
type: system
sources:
  - path: libs/dataviews-client/src/resources/get-resources.ts
    hash: f83e754fed40aa48f3454e9a5ac041875807fa0e2b313f1af8987651c0118859
  - path: libs/dataviews-client/src/resources/resources-slice.ts
    hash: 1ea07213865e0901befbdc741edf1de7dcd26a229380b13886289581f11339ec
sources_digest: bc65dbb1aef24992d1aa793d3988aca30484484efc411f43b6c027a61a55396b
links:
  - to: dataset-resolution-pipeline
    relation: uses
    description: Calls resolveEndpoint to construct API URLs for resource fetches
  - to: deck-layer-composition-rendering
    relation: produces
    description: Provides fetched and parsed layer data to composition pipeline
generator:
  version: 1
covers:
  - symbol: GetDatasetConfigCallback
    kind: type
    at: 'libs/dataviews-client/src/resources/get-resources.ts:L12-L15'
  - symbol: GetDatasetConfigsCallbacks
    kind: type
    at: 'libs/dataviews-client/src/resources/get-resources.ts:L17-L22'
  - symbol: splitTrackDataviews
    kind: function
    at: 'libs/dataviews-client/src/resources/get-resources.ts:L24-L40'
  - symbol: extendDataviewDatasetConfig
    kind: function
    at: 'libs/dataviews-client/src/resources/get-resources.ts:L42-L115'
  - symbol: getResources
    kind: function
    at: 'libs/dataviews-client/src/resources/get-resources.ts:L117-L141'
  - symbol: pickTrackResource
    kind: function
    at: 'libs/dataviews-client/src/resources/get-resources.ts:L143-L191'
  - symbol: ResourcesState
    kind: type
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L20-L20'
  - symbol: PartialStoreResources
    kind: interface
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L21-L23'
  - symbol: getVesselIdFromDatasetConfig
    kind: function
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L27-L31'
  - symbol: getTracksChunkSetId
    kind: function
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L33-L38'
  - symbol: parseEvent
    kind: function
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L40-L47'
  - symbol: FetchResourceThunkParams
    kind: type
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L49-L54'
  - symbol: ParseEventCallback
    kind: type
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L55-L55'
  - symbol: ParseTrackCallback
    kind: type
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L56-L56'
  - symbol: getChunkSetChunks
    kind: function
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L127-L136'
  - symbol: setResource
    kind: method
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L142-L145'
  - symbol: selectResources
    kind: function
    at: 'libs/dataviews-client/src/resources/resources-slice.ts:L216-L216'
---

<!-- context:generated:start -->

## Summary

Fetches, parses, and caches geospatial data (tracks, events, user tracks) from APIs and transforms them into deck.gl-compatible formats. Handles track chunking by zoom/vessel with automatic merging, compression format conversion, and event timestamp parsing.

## Related

- uses [[dataset-resolution-pipeline]] — Calls resolveEndpoint to construct API URLs for resource fetches
- produces [[deck-layer-composition-rendering]] — Provides fetched and parsed layer data to composition pipeline

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
