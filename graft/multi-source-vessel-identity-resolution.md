---
name: Multi-Source Vessel Identity Resolution
slug: multi-source-vessel-identity-resolution
type: concept
sources:
  - path: libs/api-types/src/events.ts
    hash: 9c7da1a5a7b2e3fb22224195e0b2b0150ca311666ef66916d3e57d580db38b57
  - path: libs/api-types/src/identity-vessel.ts
    hash: 7b6b9ac2c0480dfe47e46c022ff135c8487161b3325980ff375f30b70e0493f6
sources_digest: 4553df8d8ad51c923866681be85bc7cbb534b3aa2fa84af586bba8599e72a787
links:
  - to: api-types-type-definitions
    relation: part_of
    description: 'Vessel identity patterns used throughout events, tracks, and dataset APIs'
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
  - symbol: VesselType
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L1-L10'
  - symbol: GearType
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L23-L53'
  - symbol: VesselIdentitySourceEnum
    kind: enum
    at: 'libs/api-types/src/identity-vessel.ts:L87-L92'
  - symbol: SelfReportedSource
    kind: enum
    at: 'libs/api-types/src/identity-vessel.ts:L94-L111'
  - symbol: VesselInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L113-L127'
  - symbol: VesselTMTInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L129-L138'
  - symbol: SelfReportedMatchFields
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L140-L140'
  - symbol: RegistryLoginMessage
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L143-L143'
  - symbol: SelfReportedInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L145-L166'
  - symbol: RegistryImage
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L168-L171'
  - symbol: RegistryExtraFieldValue
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L173-L179'
  - symbol: RegistryExtraFields
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L181-L190'
  - symbol: VesselRegistryInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L192-L202'
  - symbol: VesselRegistryProperty
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L204-L210'
  - symbol: VesselRegistryOwner
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L212-L215'
  - symbol: VesselRegistryOperator
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L217-L220'
  - symbol: VesselRegistryAuthorization
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L222-L222'
  - symbol: VesselIdentitySearchMatch
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L224-L227'
  - symbol: VesselIdentitySearchMatchCriteria
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L229-L239'
  - symbol: CombinedSourceInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L241-L248'
  - symbol: VesselCombinedSourcesInfo
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L249-L268'
  - symbol: IdentityVessel
    kind: type
    at: 'libs/api-types/src/identity-vessel.ts:L270-L280'
---

<!-- context:generated:start -->

## Summary

Vessel identity data synthesized from three independent sources: self-reported broadcast (AIS/VMS via SelfReportedInfo with source enums for Brazil, Peru, etc.), public registry records (VesselRegistryInfo with ownership/operator chains and temporal boundaries), and combined analytics (VesselCombinedSourcesInfo aggregating conflicts across sources/time with provenance via CombinedSourceInfo entries). Authorization metadata tracked at multiple levels—per-RFMO in EncounterEventAuthorizations, per-vessel in EventVesselAuthorization. Authentication-gated fields handled via RegistryLoginMessage sentinel, forcing callers to handle auth failures gracefully during deserialization rather than throwing.

## Related

- part of [[api-types-type-definitions]] — Vessel identity patterns used throughout events, tracks, and dataset APIs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
