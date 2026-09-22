---
name: event-type-specific color styling
slug: event-type-specific-color-styling
type: concept
sources:
  - path: libs/deck-loaders/src/vessels/lib/parse-events.spec.ts
    hash: 24def944a359d7b1a64b45aea6be006caa5e1278c7b469bf90776b3d9f265d5b
  - path: libs/deck-loaders/src/vessels/lib/parse-events.ts
    hash: 9f97a9f650d8194f419e9ce52001f308b45de038056cacf4c3732962cbc50833
  - path: libs/deck-loaders/src/vessels/lib/types.ts
    hash: 6fd72f3c58d184ca0b73c99333505996a722f46717d0b06951e8c61d4f891e4d
sources_digest: c56c9fba93a88d32307edf72cddf8b05bba868c9124bdf04b7242eadc2e52a94
links:
  - to: vessel-events-parsing-pipeline
    relation: part_of
    description: >-
      parseEvents applies EVENTS_COLORS and LONGLINE_CATEGORY_COLORS to
      normalize event appearance
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

Vessel events use a two-tier color system: static EVENTS_COLORS map for event types (encounter, loitering, fishing, gap, port_visit), with special handling for longline fishing events that examines dayNightCategory (day/night/dawn/dusk) to apply LONGLINE_CATEGORY_COLORS for visual distinction. This color assignment happens during parseEvents without modifying the underlying event structure.

## Related

- part of [[vessel-events-parsing-pipeline]] — parseEvents applies EVENTS_COLORS and LONGLINE_CATEGORY_COLORS to normalize event appearance

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
