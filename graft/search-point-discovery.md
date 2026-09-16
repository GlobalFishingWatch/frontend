---
name: Search & Point Discovery
slug: search-point-discovery
type: system
sources:
  - path: apps/port-labeler/src/features/search/search.hooks.ts
    hash: 1dceac164ef86ceb40468602c5d85eb98c3f7d9ca36da4ede346447e4065362d
  - path: apps/port-labeler/src/features/search/Search.tsx
    hash: 1d7d1c0a94fdd4bb91abeaa394e9102716076e331dc476ddef4e7eda0c3f6fb6
sources_digest: 6cee4343c03d29f3ebe2c07b1cd8160c945f583ae1a5c3ce8d60013f51748908
links:
  - to: interactive-map-rendering-viewport-state
    relation: uses
    description: >-
      Search uses centerPoints from map integration via useMapConnect to
      highlight and pan to matching results
  - to: port-data-metadata-types
    relation: uses
    description: >-
      Search filters PortPosition records by top_destination, friendly names,
      and country-mapped value dictionaries
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      Search dispatches setSelectedPoints action to Redux; reads portValues,
      pointValues, subareas from labeler slice; country context from Redux
      changes filter behavior between country-specific and global search
generator:
  version: 1
covers:
  - symbol: Search
    kind: function
    at: 'apps/port-labeler/src/features/search/Search.tsx:L13-L95'
  - symbol: Dictionary
    kind: type
    at: 'apps/port-labeler/src/features/search/search.hooks.ts:L16-L16'
  - symbol: useSearchConnect
    kind: function
    at: 'apps/port-labeler/src/features/search/search.hooks.ts:L18-L106'
  - symbol: compareProperty
    kind: function
    at: 'apps/port-labeler/src/features/search/search.hooks.ts:L29-L33'
  - symbol: filterFiels
    kind: function
    at: 'apps/port-labeler/src/features/search/search.hooks.ts:L35-L59'
  - symbol: searchPoints
    kind: function
    at: 'apps/port-labeler/src/features/search/search.hooks.ts:L61-L101'
---

<!-- context:generated:start -->

## Summary

Provides collapsible search interface for querying ports, subareas, anchorages, and destinations across geographic datasets. useSearchConnect hook integrates Redux state with map centerPoints capability; search filtering branches on type (destination queries top_destination field, while port/subarea/anchorage use country-specific value dictionaries); results dispatch to both map and Redux state.

## Related

- uses [[interactive-map-rendering-viewport-state]] — Search uses centerPoints from map integration via useMapConnect to highlight and pan to matching results
- uses [[port-data-metadata-types]] — Search filters PortPosition records by top_destination, friendly names, and country-mapped value dictionaries
- uses [[redux-state-management-for-labeler]] — Search dispatches setSelectedPoints action to Redux; reads portValues, pointValues, subareas from labeler slice; country context from Redux changes filter behavior between country-specific and global search

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
