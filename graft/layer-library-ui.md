---
name: Layer Library UI
slug: layer-library-ui
type: system
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibrary.tsx
    hash: e1d925c7743fd0dd9e737449d39f377dfd38f9dfab2be6fca2002cc6b8ae5dc5
  - path: apps/platform/features/_map/layer-library/LayerLibrary.utils.ts
    hash: 0dff650704bbc856e5f83bc7d3484b7e892200641b9cefda781d51da18f0c9d4
  - path: apps/platform/features/_map/layer-library/LayerLibraryItem.tsx
    hash: 669df2e49a77c7c96f3a813bcca6a2642117cdae498437fdfb6920a3faac5ddb
  - path: apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx
    hash: afd856a337d94a7a987af883a2fec8080eb8570120b5009501993f4c960beba3
  - path: apps/platform/features/_map/layer-library/LayerLibraryVesselGroupPanel.tsx
    hash: 27e978741fab4f63974088c58290e51e24a4240134567fcdf457b14be1822c5d
sources_digest: ffc37764ce4a5a69c8e645e8035ee80eaf3f396e75c451732fc29c51cd3cd7c5
links:
  - to: dataset-state-management
    relation: uses
    description: >-
      Dispatches dataset fetch thunks and uses Redux selectors to access user
      and dataset state
  - to: dataview-state-management
    relation: uses
    description: >-
      Uses Redux selectors and dispatch actions to fetch and manage dataview
      instances when adding layers
  - to: map-controls-system
    relation: part_of
    description: Layer library is invoked as a modal control from the map interface
  - to: workspace-color-assignment
    relation: uses
    description: >-
      Automatically assigns colors to new layer instances via getNextColor
      utility, avoiding conflicts with existing colors
generator:
  version: 1
covers:
  - symbol: UserSubcategory
    kind: type
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L46-L46'
  - symbol: LayerLibrary
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.tsx:L48-L416'
  - symbol: resolveLibraryLayers
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.utils.ts:L12-L65'
  - symbol: scrollToLayerLibrarySection
    kind: function
    at: 'apps/platform/features/_map/layer-library/LayerLibrary.utils.ts:L67-L69'
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
  - symbol: LayerLibraryVesselGroupPanel
    kind: function
    at: >-
      apps/platform/features/_map/layer-library/LayerLibraryVesselGroupPanel.tsx:L35-L167
---

<!-- context:generated:start -->

## Summary

A searchable, categorized modal interface for discovering and selecting map layers, organizing datasets, vessel groups, and user-uploaded data by geometry type and category. It lazily loads user datasets only for authenticated users, dynamically filters categories based on search results, and tracks scroll position to highlight the current sidebar category.

## Related

- uses [[dataset-state-management]] — Dispatches dataset fetch thunks and uses Redux selectors to access user and dataset state
- uses [[dataview-state-management]] — Uses Redux selectors and dispatch actions to fetch and manage dataview instances when adding layers
- part of [[map-controls-system]] — Layer library is invoked as a modal control from the map interface
- uses [[workspace-color-assignment]] — Automatically assigns colors to new layer instances via getNextColor utility, avoiding conflicts with existing colors

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
