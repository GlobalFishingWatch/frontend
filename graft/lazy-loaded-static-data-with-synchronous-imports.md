---
name: lazy-loaded static data with synchronous imports
slug: lazy-loaded-static-data-with-synchronous-imports
type: concept
sources:
  - path: libs/deck-loaders/src/vessels/lib/types.ts
    hash: 6fd72f3c58d184ca0b73c99333505996a722f46717d0b06951e8c61d4f891e4d
  - path: libs/ocean-areas/src/ocean-areas.ts
    hash: 997778922e2970c2208b107fe0e896a3b3f358bcb67d5dcd8f1b17cb775a1cb9
sources_digest: 759c8ac4e8cf0faac95e95582a13fb50e4c8ed51aa8d84eca56f10b6d223d490
links:
  - to: ocean-areas-geospatial-querying
    relation: part_of
    description: >-
      oceanAreas and oceanAreasLocales objects are initialized on first access
      to searchOceanAreas, getOverlappingAreas, etc.
generator:
  version: 1
covers:
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
  - symbol: importOceanAreasData
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L19-L24'
  - symbol: OceanAreaLocaleKey
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L26-L26'
  - symbol: OceanAreaType
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L27-L27'
  - symbol: OceanAreaBBox
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L28-L28'
  - symbol: OceanAreaProperties
    kind: interface
    at: 'libs/ocean-areas/src/ocean-areas.ts:L32-L40'
  - symbol: OceanArea
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L42-L42'
  - symbol: OceanAreaLocale
    kind: enum
    at: 'libs/ocean-areas/src/ocean-areas.ts:L44-L49'
  - symbol: GetOceanAreaNameLocaleParam
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L63-L65'
  - symbol: localizeName
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L67-L72'
  - symbol: localizeArea
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L74-L91'
  - symbol: SearchOceanAreaParams
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L93-L93'
  - symbol: searchOceanAreas
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L94-L121'
  - symbol: LatLon
    kind: interface
    at: 'libs/ocean-areas/src/ocean-areas.ts:L123-L126'
  - symbol: Viewport
    kind: interface
    at: 'libs/ocean-areas/src/ocean-areas.ts:L128-L130'
  - symbol: getOverlappingAreas
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L132-L143'
  - symbol: getAreasByDistance
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L145-L155'
  - symbol: GetOceanAreaParams
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L160-L160'
  - symbol: getOceanAreas
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L161-L183'
  - symbol: GetOceanAreaNameParams
    kind: type
    at: 'libs/ocean-areas/src/ocean-areas.ts:L185-L185'
  - symbol: getOceanAreaName
    kind: function
    at: 'libs/ocean-areas/src/ocean-areas.ts:L186-L210'
---

<!-- context:generated:start -->

## Summary

Ocean areas, event colors, and locale data are imported as static modules but accessed through lazy-loaded patterns (first-use caching in oceanAreas, oceanAreasLocales objects). This balances bundle-size efficiency with startup time: data is only deserialized when queries actually run. Assumes all dynamic imports resolve synchronously before queries execute.

## Related

- part of [[ocean-areas-geospatial-querying]] — oceanAreas and oceanAreasLocales objects are initialized on first access to searchOceanAreas, getOverlappingAreas, etc.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
