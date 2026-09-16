---
name: vessel-events parsing pipeline
slug: vessel-events-parsing-pipeline
type: system
sources:
  - path: libs/deck-loaders/src/vessels/lib/parse-events.spec.ts
    hash: 24def944a359d7b1a64b45aea6be006caa5e1278c7b469bf90776b3d9f265d5b
  - path: libs/deck-loaders/src/vessels/lib/parse-events.ts
    hash: 9f97a9f650d8194f419e9ce52001f308b45de038056cacf4c3732962cbc50833
  - path: libs/deck-loaders/src/vessels/lib/types.ts
    hash: 6fd72f3c58d184ca0b73c99333505996a722f46717d0b06951e8c61d4f891e4d
sources_digest: c56c9fba93a88d32307edf72cddf8b05bba868c9124bdf04b7242eadc2e52a94
links:
  - to: vessel-events-loaders-loaders-gl
    relation: produces
    description: >-
      parseEvents is invoked by VesselEventsLoader and VesselEventsWorkerLoader
      to decode and transform event records
generator:
  version: 1
covers:
  - symbol: toArrayBuffer
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-events.spec.ts:L5-L8'
  - symbol: longlineSet
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-events.spec.ts:L92-L98'
  - symbol: decodeEventsBuffer
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-events.ts:L13-L16'
  - symbol: parseEvents
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/parse-events.ts:L18-L35'
  - symbol: LonglineCategory
    kind: type
    at: 'libs/deck-loaders/src/vessels/lib/types.ts:L15-L15'
  - symbol: isLonglineSetEvent
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/types.ts:L24-L24'
  - symbol: getLonglineCategory
    kind: function
    at: 'libs/deck-loaders/src/vessels/lib/types.ts:L26-L31'
  - symbol: VesselTrackGraphExtent
    kind: type
    at: 'libs/deck-loaders/src/vessels/lib/types.ts:L33-L33'
  - symbol: VesselTrackData
    kind: type
    at: 'libs/deck-loaders/src/vessels/lib/types.ts:L35-L56'
  - symbol: VesselDeckLayersEventData
    kind: type
    at: 'libs/deck-loaders/src/vessels/lib/types.ts:L58-L66'
---

<!-- context:generated:start -->

## Summary

Transforms raw vessel event data from ArrayBuffer-encoded JSON into deck layer geometry with normalized coordinates, millisecond timestamps, and event-type-specific colors. Applies specialized color logic for longline fishing events based on day/night/dawn/dusk categories.

## Related

- produces [[vessel-events-loaders-loaders-gl]] — parseEvents is invoked by VesselEventsLoader and VesselEventsWorkerLoader to decode and transform event records

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
