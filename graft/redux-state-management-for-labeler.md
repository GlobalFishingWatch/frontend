---
name: Redux State Management for Labeler
slug: redux-state-management-for-labeler
type: system
sources:
  - path: apps/port-labeler/src/features/labeler/labeler.selectors.ts
    hash: 772101cd783bf782642fb75542e588ed5292a0412d747f425cfee13ff814e311
  - path: apps/port-labeler/src/features/labeler/labeler.slice.ts
    hash: 6d9e7f372edc1bc65d952050a446eddd4f623b551a33c6bb7588a4c287a64251
  - path: apps/port-labeler/src/features/sidebar/sidebar.hooks.ts
    hash: f9411a8a0866265a8d853aea313f6c71d9fdb3ca8dfd2bd31da3508d388356e3
sources_digest: 196c8eecb8a0dd9a519206cd97d3fb04912f24588c4e650a50b9ddb9f7e525fb
links:
  - to: file-i-o-country-level-filtering
    relation: uses
    description: >-
      Sidebar hooks dispatch setData, setCountriesMetadata, setPorts,
      setSubareas actions to hydrate labeler slice from uploads;
      assignLabeledValues and download serialization depend on labeler state
      shape
  - to: interactive-map-rendering-viewport-state
    relation: produces
    description: >-
      Labeler slice exports layer definitions (selectPortPositionLayer,
      selectAreaLayer) that MapWrapper merges into map style
  - to: port-data-metadata-types
    relation: uses
    description: >-
      Labeler slice normalizes PortPosition, PortSubarea, and label assignments;
      generateUniqueLabelID and deduplication logic depend on data structure
      contracts
  - to: table-anchorage-editing-interface
    relation: uses
    description: >-
      Labeler slice dispatches changePointValue, changeSubareaValue,
      changePortValue actions from table row edits; selectFilteredPoints
      selector gates table visibility by map bounds
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
  - symbol: useSelectedTracksConnect
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L25-L266'
  - symbol: findPortName
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L35-L41'
  - symbol: findSubareaName
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L42-L48'
  - symbol: assignLabeledValues
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L50-L76'
  - symbol: dispatchDownload
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L79-L87'
  - symbol: parseCountriesMetadata
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L89-L128'
  - symbol: handleFileUploaded
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L133-L149'
  - symbol: dispatchImportHandler
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L155-L161'
  - symbol: onCountryChange
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/sidebar.hooks.ts:L164-L259'
---

<!-- context:generated:start -->

## Summary

Central Redux slice managing labeled point data (ports, subareas, point values), country filtering, metadata persistence, and import/export workflows. Stores Redux-selected layers for map, labeled values per s2id, country list, and provides selectors for filtered points within map bounds. Maintains deduplication logic for ports/subareas by ID or name, fallback ID generation when names only exist, and merges original data with user-edited labels during serialization.

## Related

- uses [[file-i-o-country-level-filtering]] — Sidebar hooks dispatch setData, setCountriesMetadata, setPorts, setSubareas actions to hydrate labeler slice from uploads; assignLabeledValues and download serialization depend on labeler state shape
- produces [[interactive-map-rendering-viewport-state]] — Labeler slice exports layer definitions (selectPortPositionLayer, selectAreaLayer) that MapWrapper merges into map style
- uses [[port-data-metadata-types]] — Labeler slice normalizes PortPosition, PortSubarea, and label assignments; generateUniqueLabelID and deduplication logic depend on data structure contracts
- uses [[table-anchorage-editing-interface]] — Labeler slice dispatches changePointValue, changeSubareaValue, changePortValue actions from table row edits; selectFilteredPoints selector gates table visibility by map bounds

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
