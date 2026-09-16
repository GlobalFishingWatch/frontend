---
name: ocean-areas geospatial querying
slug: ocean-areas-geospatial-querying
type: system
sources:
  - path: libs/ocean-areas/src/data/index.ts
    hash: 26de4ce1fe8f5befaa447214daef80ee3848aaa100967e26194b9e39c8e0ae05
  - path: libs/ocean-areas/src/locales/index.ts
    hash: 84a8e35df1881773b342e1b5aafe2793604bfe8f082fedb047794bcc65b084bf
  - path: libs/ocean-areas/src/ocean-areas.ts
    hash: 997778922e2970c2208b107fe0e896a3b3f358bcb67d5dcd8f1b17cb775a1cb9
sources_digest: e33c73e46bf6c20f141d15b42993a58e18392ca67f7784355a5e0ab9e678038b
links:
  - to: ocean-areas-datasets
    relation: uses
    description: >-
      Lazy-loads EEZ, MPA, FAO, RFMO, and port GeoJSON collections; performs
      booleanPointInPolygon, bbox, distance, explode queries via Turf.js
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

Provides full-text search, point-in-polygon overlap detection, proximity ranking, and zoom-aware localization for maritime boundaries (EEZs, MPAs, FAO areas, RFMOs, ports). Prefers EEZs above zoom 5; returns 'Global' for zoomed-out views. Lazy-loads GeoJSON datasets and locale translations on first use.

## Related

- uses [[ocean-areas-datasets]] — Lazy-loads EEZ, MPA, FAO, RFMO, and port GeoJSON collections; performs booleanPointInPolygon, bbox, distance, explode queries via Turf.js

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
