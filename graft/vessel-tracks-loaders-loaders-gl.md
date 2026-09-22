---
name: vessel-tracks loaders (loaders.gl)
slug: vessel-tracks-loaders-loaders-gl
type: system
sources:
  - path: libs/deck-loaders/src/vessels/tracks-loader.ts
    hash: da5eb5f85719ebf79c2cb0a53ceb8fb13beb91e9786f542ade9eef14a519e7e6
  - path: libs/deck-loaders/src/vessels/workers/vessel-tracks-worker.ts
    hash: aa98a7cd8788ddacd044d35fe353bc4ba1974a40b6f03d09f60d8846e0bb1e34
sources_digest: 89dc94f4f7d40a614c665954598f59be3313a1b96f7a48f57f3931fcad7be55a
links:
  - to: vessel-tracks-parsing-pipeline
    relation: uses
    description: >-
      Both loaders invoke parseTrack to decode and normalize vessel tracking
      data
generator:
  version: 1
covers:
  - symbol: VesselTrackLoaderOptions
    kind: type
    at: 'libs/deck-loaders/src/vessels/tracks-loader.ts:L16-L20'
---

<!-- context:generated:start -->

## Summary

Loaders.gl-compatible framework for vessel track data with protobuf parsing and dual execution paths. VesselTrackWorkerLoader offloads parsing to vessel-tracks-worker.js; VesselTrackLoader provides synchronous and asynchronous backends via parseTrack.

## Related

- uses [[vessel-tracks-parsing-pipeline]] — Both loaders invoke parseTrack to decode and normalize vessel tracking data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
