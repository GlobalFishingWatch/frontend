---
name: Event Taxonomy & Authorization Compliance
slug: event-taxonomy-authorization-compliance
type: concept
sources:
  - path: libs/api-types/src/events.ts
    hash: 9c7da1a5a7b2e3fb22224195e0b2b0150ca311666ef66916d3e57d580db38b57
sources_digest: d84e62ec495e7830fb1c7d520f28b7c02c649f4b5df58d0ceb78e9d650c39ef9
links:
  - to: api-types-type-definitions
    relation: part_of
    description: >-
      Event taxonomy and authorization patterns central to compliance and
      tracking domains
generator:
  version: 1
covers:
  - symbol: PointCoordinate
    kind: type
    at: 'libs/api-types/src/events.ts:L1-L4'
  - symbol: RegionType
    kind: enum
    at: 'libs/api-types/src/events.ts:L6-L13'
  - symbol: Regions
    kind: type
    at: 'libs/api-types/src/events.ts:L15-L22'
  - symbol: GapPosition
    kind: type
    at: 'libs/api-types/src/events.ts:L24-L26'
  - symbol: EventTypes
    kind: enum
    at: 'libs/api-types/src/events.ts:L28-L35'
  - symbol: EventType
    kind: type
    at: 'libs/api-types/src/events.ts:L37-L37'
  - symbol: EventNextPort
    kind: type
    at: 'libs/api-types/src/events.ts:L39-L44'
  - symbol: EventVesselTypeEnum
    kind: enum
    at: 'libs/api-types/src/events.ts:L46-L49'
  - symbol: AuthorizationType
    kind: type
    at: 'libs/api-types/src/events.ts:L51-L51'
  - symbol: EventAuthorization
    kind: type
    at: 'libs/api-types/src/events.ts:L53-L56'
  - symbol: EventVesselAuthorization
    kind: type
    at: 'libs/api-types/src/events.ts:L58-L61'
  - symbol: EventVessel
    kind: type
    at: 'libs/api-types/src/events.ts:L63-L72'
  - symbol: RFMOs
    kind: type
    at: 'libs/api-types/src/events.ts:L74-L75'
  - symbol: EncounterEventAuthorizations
    kind: type
    at: 'libs/api-types/src/events.ts:L77-L84'
  - symbol: AuthorizationOptions
    kind: enum
    at: 'libs/api-types/src/events.ts:L86-L90'
  - symbol: EncounterEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L92-L117'
  - symbol: LoiteringEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L119-L124'
  - symbol: PortEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L126-L132'
  - symbol: Anchorage
    kind: type
    at: 'libs/api-types/src/events.ts:L134-L144'
  - symbol: PortVisitEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L146-L153'
  - symbol: GapEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L155-L167'
  - symbol: GapsEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L169-L174'
  - symbol: FishingEventDayNightCategory
    kind: type
    at: 'libs/api-types/src/events.ts:L176-L176'
  - symbol: LonglineFishingFields
    kind: type
    at: 'libs/api-types/src/events.ts:L179-L186'
  - symbol: FishingEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L188-L192'
  - symbol: Distances
    kind: type
    at: 'libs/api-types/src/events.ts:L194-L199'
  - symbol: ApiEvent
    kind: type
    at: 'libs/api-types/src/events.ts:L201-L220'
  - symbol: ApiEvents
    kind: type
    at: 'libs/api-types/src/events.ts:L222-L226'
---

<!-- context:generated:start -->

## Summary

Maritime event types (EncounterEvent, FishingEvent, PortVisitEvent, LoiteringEvent, GapEvent, PortEvent) compose distinct vessel behaviors. EncounterEvent includes EventVessel with per-RFMO EncounterEventAuthorizations tracking fishing authorization status. Regions type maps zone types (EEZ, RFMO, MPA, FAO) to identifier lists for compliance context. FishingEvent optionally composes LonglineFishingFields rather than inheritance for dataset-specific attributes. AuthorizationOptions aggregate multiple authorization levels. Timestamps use number|string deferring parsing; optional fields like coordinates, distances suggest backward compatibility or conditional enrichment. Design reflects international fishing regulation complexity requiring multi-level authorization tracking.

## Related

- part of [[api-types-type-definitions]] — Event taxonomy and authorization patterns central to compliance and tracking domains

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
