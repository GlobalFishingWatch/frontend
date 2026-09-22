---
name: vessel-events loaders (loaders.gl)
slug: vessel-events-loaders-loaders-gl
type: system
sources:
  - path: libs/deck-loaders/src/vessels/events-loader.ts
    hash: 737471daff378b3dc3dc6c72ebf4a2ab3a6644e9f5cc6dfaaede684d3511c626
  - path: libs/deck-loaders/src/vessels/workers/vessel-events-worker.ts
    hash: d85182e1c6af727e2dba1648a8af299fc1ae47396a2ea15285a46a82e064934a
sources_digest: 436a378b43d2a2bb7348a2f4bcb5a5cc841df9e8e50f92a5226fe9296e5ddd5d
links:
  - to: vessel-events-parsing-pipeline
    relation: uses
    description: >-
      Both loaders invoke parseEvents to deserialize and transform vessel event
      records
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Loaders.gl-compatible loader framework for vessel event data with web worker and direct synchronous/asynchronous parse paths. VesselEventsWorkerLoader delegates to vessel-events-worker.js; VesselEventsLoader provides parse methods backed by parseEvents.

## Related

- uses [[vessel-events-parsing-pipeline]] — Both loaders invoke parseEvents to deserialize and transform vessel event records

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
