---
name: Labeler State Management
slug: labeler-state-management
type: system
sources:
  - path: apps/port-labeler/src/features/labeler/labeler.selectors.ts
    hash: 772101cd783bf782642fb75542e588ed5292a0412d747f425cfee13ff814e311
  - path: apps/port-labeler/src/features/labeler/labeler.slice.ts
    hash: 6d9e7f372edc1bc65d952050a446eddd4f623b551a33c6bb7588a4c287a64251
sources_digest: 90858aeaddff0c1eedb1ef5d72da393da9b3c2210eb51439513ae1977161e017
links:
  - to: port-labeler-map-system
    relation: produces
    description: >-
      Selectors produce filtered port points, subareas, and their values for map
      rendering
  - to: redux-store
    relation: part_of
    description: >-
      Labeler slice is a Redux Toolkit reducer and selector set integrated into
      the app store
generator:
  version: 1
covers:
  - symbol: ValuesObject
    kind: interface
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L8-L10'
  - symbol: CountryMap
    kind: interface
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L11-L13'
  - symbol: CountrySelectMap
    kind: interface
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L14-L16'
  - symbol: ProjectSlice
    kind: type
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L18-L31'
  - symbol: selectDisplayExtraData
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L236-L236'
  - symbol: selectSelectedPoints
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L237-L237'
  - symbol: selectCountry
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L238-L238'
  - symbol: selectHoverPoint
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L239-L239'
  - symbol: selectSubareas
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L240-L240'
  - symbol: selectPorts
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L241-L241'
  - symbol: selectMapData
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L242-L242'
  - symbol: selectPortValues
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L243-L243'
  - symbol: selectSubareaValues
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L244-L244'
  - symbol: selectPointValues
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L245-L245'
  - symbol: selectCountries
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L246-L246'
  - symbol: selectCountryColors
    kind: function
    at: 'apps/port-labeler/src/features/labeler/labeler.slice.ts:L247-L247'
---

<!-- context:generated:start -->

## Summary

Redux Toolkit slice (labeler.slice) that manages the complete state for port labeling operations: geographic points, ports, subareas, their metadata, selection tracking, and UI state (hover, country context). Provides 18 action creators for mutations and 12 selectors for derived state. Many reducers gate on country selection, making it a critical dependency.

## Related

- produces [[port-labeler-map-system]] — Selectors produce filtered port points, subareas, and their values for map rendering
- part of [[redux-store]] — Labeler slice is a Redux Toolkit reducer and selector set integrated into the app store

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
