---
name: zoom-aware localization with fallback hierarchy
slug: zoom-aware-localization-with-fallback-hierarchy
type: concept
sources:
  - path: libs/ocean-areas/src/ocean-areas.ts
    hash: 997778922e2970c2208b107fe0e896a3b3f358bcb67d5dcd8f1b17cb775a1cb9
sources_digest: 0a843d1d5d974778ac7a997364757d9b3dd2b5aa69a2f1edb3d7763bdbc2a7fe
links:
  - to: ocean-areas-geospatial-querying
    relation: part_of
    description: >-
      getOceanAreaName implements zoom thresholds (MIN_ZOOM_NOT_GLOBAL = 3,
      MIN_ZOOM_TO_PREFER_EEZS = 5) and fallback logic
generator:
  version: 1
covers:
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

Ocean area names adapt to viewport zoom: above zoom 5, EEZs are preferred; below zoom 3, 'Global' is returned regardless of overlap. When no area overlaps, the nearest area is selected. Locale data falls back to the area key if translation is missing. This design prioritizes meaningful labels at different scales while gracefully degrading when data is unavailable.

## Related

- part of [[ocean-areas-geospatial-querying]] — getOceanAreaName implements zoom thresholds (MIN_ZOOM_NOT_GLOBAL = 3, MIN_ZOOM_TO_PREFER_EEZS = 5) and fallback logic

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
