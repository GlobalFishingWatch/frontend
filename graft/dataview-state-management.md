---
name: Dataview State Management
slug: dataview-state-management
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibraryItem.tsx
    hash: 669df2e49a77c7c96f3a813bcca6a2642117cdae498437fdfb6920a3faac5ddb
  - path: apps/platform/features/_map/layer-library/LayerLibraryUserPanel.tsx
    hash: afd856a337d94a7a987af883a2fec8080eb8570120b5009501993f4c960beba3
  - path: apps/platform/features/_map/layer-library/LayerLibraryVesselGroupPanel.tsx
    hash: 27e978741fab4f63974088c58290e51e24a4240134567fcdf457b14be1822c5d
  - path: apps/platform/features/_map/map/controls/MapSearch.tsx
    hash: e5664efb8d6bf474434bc5e2514af5eed388a145f604d080b3bbcee82f3392f2
  - path: apps/platform/features/_map/map/controls/ReferenceLayersControl.tsx
    hash: bfab3b0fd74ea90fe56508ea0b18b0c8699c7eb091e7580cd1223a48cb2b8bc7
  - path: apps/platform/features/_map/map/map-layers.hooks.ts
    hash: 5fc3067318fe770349b731249200c9dba092a0903dd3864ca2609b5cd8c312bf
sources_digest: d9125e80b8153d1f7b2b9018ebbb97b22ce11004eafb08e185cce1ff4b82f302
links:
  - to: layer-library-ui
    relation: implements
    description: >-
      Provides dataview API and workspace instance management when users add
      layers
  - to: map-controls-system
    relation: implements
    description: >-
      Enables basemap switching, search result activation, and reference layer
      toggling
  - to: map-layers
    relation: implements
    description: Provides dataview instance data for layer composition
generator:
  version: 1
covers:
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
  - symbol: MapSearch
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L34-L220'
  - symbol: onSelectResult
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L50-L89'
  - symbol: onInputChange
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L91-L108'
  - symbol: ReferenceLayer
    kind: type
    at: >-
      apps/platform/features/_map/map/controls/ReferenceLayersControl.tsx:L20-L26
  - symbol: ReferenceLayersControl
    kind: function
    at: >-
      apps/platform/features/_map/map/controls/ReferenceLayersControl.tsx:L28-L118
  - symbol: useActivityDataviewId
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L69-L82'
  - symbol: useGlobalConfigConnect
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L84-L182'
  - symbol: useMapDataviewsLayers
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L184-L224'
  - symbol: useHotspotOverlayLayer
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L226-L244'
  - symbol: useMapOverlayLayers
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L246-L256'
  - symbol: useMapLayers
    kind: function
    at: 'apps/platform/features/_map/map/map-layers.hooks.ts:L258-L264'
---

<!-- context:generated:start -->

## Summary

Redux-based system for managing map layer definitions, workspace instances, and visibility. Coordinates async fetching of dataview metadata (via fetchDataviewsByIdsThunk) with state updates, enabling components to add/remove/toggle layers. Distinguishes between dataview definitions (from API) and workspace instances (user-specific configuration).

## Related

- implements [[layer-library-ui]] — Provides dataview API and workspace instance management when users add layers
- implements [[map-controls-system]] — Enables basemap switching, search result activation, and reference layer toggling
- implements [[map-layers]] — Provides dataview instance data for layer composition

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
