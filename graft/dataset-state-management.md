---
name: Dataset State Management
slug: dataset-state-management
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibrary.tsx
    hash: e1d925c7743fd0dd9e737449d39f377dfd38f9dfab2be6fca2002cc6b8ae5dc5
  - path: apps/platform/features/_map/layer-library/LayerLibraryItem.tsx
    hash: 669df2e49a77c7c96f3a813bcca6a2642117cdae498437fdfb6920a3faac5ddb
  - path: apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx
    hash: afd856a337d94a7a987af883a2fec8080eb8570120b5009501993f4c960beba3
  - path: apps/platform/features/_map/map/drag-dataset.hooks.ts
    hash: 2bd2b7c3d0288cb27ad7efc103c924a59482663a234f8235bc0ddeae8ad1687d
sources_digest: a2f77ff08c43c5d39531c55540d7f155fb2f404f499e003166e1ccd708dbc7a9
links:
  - to: layer-library-ui
    relation: implements
    description: Provides user dataset fetching and categorization for library display
  - to: map-rendering-core
    relation: implements
    description: Enables drag-and-drop dataset uploads via useDatasetDrag
generator:
  version: 1
covers:
  - symbol: UserSubcategory
    kind: type
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L46-L46'
  - symbol: LayerLibrary
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L48-L416'
  - symbol: LayerLibraryItemProps
    kind: type
    at: 'apps/platform/features/_map/layer-library/LayerLibraryItem.tsx:L36-L36'
  - symbol: LayerLibraryItem
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibraryItem.tsx:L40-L146'
  - symbol: onAddToWorkspaceClick
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibraryItem.tsx:L66-L106'
  - symbol: LayerLibraryUserPanel
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx:L41-L295
  - symbol: SectionComponent
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx:L115-L246
  - symbol: useDatasetDrag
    kind: function
    at: 'apps/platform/features/_map/map/drag-dataset.hooks.ts:L15-L121'
---

<!-- context:generated:start -->

## Summary

Redux-based system managing user-uploaded datasets and their metadata (name, source, geometry type, upload status). Coordinates async fetches (fetchAllDatasetsThunk, fetchDatasetsByIdsThunk) with UI state, categorizes datasets by geometry type for library display, and integrates dataset uploads via modals triggered by drag-and-drop.

## Related

- implements [[layer-library-ui]] — Provides user dataset fetching and categorization for library display
- implements [[map-rendering-core]] — Enables drag-and-drop dataset uploads via useDatasetDrag

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
