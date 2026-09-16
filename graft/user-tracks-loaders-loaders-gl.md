---
name: user-tracks loaders (loaders.gl)
slug: user-tracks-loaders-loaders-gl
type: system
sources:
  - path: libs/deck-loaders/src/user/user-tracks-loader.ts
    hash: 6b0f1286fce9c20f173f5262014ac822a426d482b341e3aa29418f49f086b086
  - path: libs/deck-loaders/src/user/workers/user-tracks-worker.ts
    hash: aa950fe6b94797b3b4a3c3b66c385ca95e012e00510f2803609668d1a25734af
sources_digest: 04fe853e7210df3802e01ca1c7c38f2b323ef1ec78c989e8edb6d93509d134b1
links:
  - to: user-tracks-parsing-pipeline
    relation: uses
    description: Both loaders invoke parseUserTrack to deserialize and parse track data
generator:
  version: 1
covers:
  - symbol: UserTracksLoaderOptions
    kind: type
    at: 'libs/deck-loaders/src/user/user-tracks-loader.ts:L13-L15'
---

<!-- context:generated:start -->

## Summary

Loaders.gl-compatible loader framework for user track data with dual synchronous/asynchronous parse paths and web worker offloading. UserTrackWorkerLoader delegates to a worker thread via user-tracks-worker.js; UserTrackLoader provides direct parsing via parseUserTrack.

## Related

- uses [[user-tracks-parsing-pipeline]] — Both loaders invoke parseUserTrack to deserialize and parse track data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
