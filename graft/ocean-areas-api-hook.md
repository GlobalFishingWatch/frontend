---
name: Ocean Areas API Hook
slug: ocean-areas-api-hook
type: system
sources:
  - path: apps/platform/hooks/ocean-areas.ts
    hash: c333b49e1a407378d4cb92dca5dfd8b676bef9c1885f5230bc0619f02a7ad05b
sources_digest: 3b12cbe0b073031602a98f9b7c8b533358f2f4764afc16b0e7ea22053e84fd15
links:
  - to: data-query-api-integration
    relation: depends_on
    description: >-
      Uses backend API endpoints /api/ocean-areas/search and
      /api/ocean-areas/name
generator:
  version: 1
covers:
  - symbol: SearchOceanAreasParams
    kind: type
    at: 'apps/platform/hooks/ocean-areas.ts:L8-L12'
  - symbol: GetOceanAreaNameParams
    kind: type
    at: 'apps/platform/hooks/ocean-areas.ts:L14-L18'
  - symbol: searchOceanAreasFn
    kind: function
    at: 'apps/platform/hooks/ocean-areas.ts:L22-L44'
  - symbol: getOceanAreaNameFn
    kind: function
    at: 'apps/platform/hooks/ocean-areas.ts:L46-L68'
  - symbol: useOceanAreas
    kind: function
    at: 'apps/platform/hooks/ocean-areas.ts:L70-L104'
---

<!-- context:generated:start -->

## Summary

Provides debounced (300ms) async hooks for querying ocean area data: searchOceanAreas searches by query/locale/types, getOceanAreaName retrieves ocean area at viewport coordinates with optional EEZ data. Debouncing via timeout refs prevents rapid successive requests.

## Related

- depends on [[data-query-api-integration]] — Uses backend API endpoints /api/ocean-areas/search and /api/ocean-areas/name

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
