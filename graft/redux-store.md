---
name: Redux Store
slug: redux-store
type: concept
sources:
  - path: apps/port-labeler/src/features/app/app.hooks.ts
    hash: d33162aa36a9a7d475e02e8ea3a02880a537cc65cfd40b7a0fa655db215ca868
  - path: apps/port-labeler/src/features/labeler/labeler.slice.ts
    hash: 6d9e7f372edc1bc65d952050a446eddd4f623b551a33c6bb7588a4c287a64251
sources_digest: 714471d755af0cd93652c13cd94b79be60fae3d1a15f472c84734abf126bf8f5
links:
  - to: port-labeler-app
    relation: uses
    description: App and components dispatch actions and select state via Redux hooks
generator:
  version: 1
covers:
  - symbol: useAppDispatch
    kind: function
    at: 'apps/port-labeler/src/features/app/app.hooks.ts:L7-L7'
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

Central Redux state management using Redux Toolkit for the port-labeler app. Coordinates labeler.slice mutations and selectors, user authentication, and shared app state. Custom typed hooks (useAppDispatch, useAppSelector) enforce type safety across all connected components.

## Related

- uses [[port-labeler-app]] — App and components dispatch actions and select state via Redux hooks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
