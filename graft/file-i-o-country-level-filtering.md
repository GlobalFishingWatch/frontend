---
name: File I/O & Country-Level Filtering
slug: file-i-o-country-level-filtering
type: system
sources:
  - path: apps/port-labeler/src/features/sidebar/sidebar.hooks.ts
    hash: f9411a8a0866265a8d853aea313f6c71d9fdb3ca8dfd2bd31da3508d388356e3
  - path: apps/port-labeler/src/features/sidebar/SidebarHeader.tsx
    hash: b6afa1d69ba0ad7f22cea80ee3e355fff1596f7580a99deedbffe82df3714bd9
sources_digest: c44196e45c551b10259df04010463f45a08233530bcbb1485e11768663fce808
links:
  - to: color-assignment-system
    relation: uses
    description: >-
      Calls getFixedColorForUnknownLabel to ensure consistent colors for new
      subareas/ports during import
  - to: interactive-map-rendering-viewport-state
    relation: uses
    description: >-
      onCountryChange uses useMapConnect hook to center map on filtered country
      data
  - to: redux-state-management-for-labeler
    relation: uses
    description: >-
      Dispatches setData, setCountriesMetadata, setPorts, setSubareas actions to
      Redux; reads selectMapData, selectCountry, portValues, subareaValues
      selectors
generator:
  version: 1
covers:
  - symbol: HeaderProps
    kind: interface
    at: 'apps/port-labeler/src/features/sidebar/SidebarHeader.tsx:L15-L17'
  - symbol: SidebarHeader
    kind: function
    at: 'apps/port-labeler/src/features/sidebar/SidebarHeader.tsx:L18-L79'
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

useSelectedTracksConnect hook manages data import/export and country filtering for port labeling. Exports dispatchDownload (serializes labeled points to JSON), dispatchImportHandler (parses uploaded files into Redux), and onCountryChange (filters records and populates country-specific selectors). Handles deduplication, fallback ID generation, and merges Redux-edited labels with original data during download.

## Related

- uses [[color-assignment-system]] — Calls getFixedColorForUnknownLabel to ensure consistent colors for new subareas/ports during import
- uses [[interactive-map-rendering-viewport-state]] — onCountryChange uses useMapConnect hook to center map on filtered country data
- uses [[redux-state-management-for-labeler]] — Dispatches setData, setCountriesMetadata, setPorts, setSubareas actions to Redux; reads selectMapData, selectCountry, portValues, subareaValues selectors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
