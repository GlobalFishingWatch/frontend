---
name: Workspace Color Assignment
slug: workspace-color-assignment
type: concept
sources:
  - path: apps/platform/features/_map/layer-library/LayerLibrary.utils.ts
    hash: 0dff650704bbc856e5f83bc7d3484b7e892200641b9cefda781d51da18f0c9d4
  - path: apps/platform/features/_map/layer-library/LayerLibraryItem.tsx
    hash: 669df2e49a77c7c96f3a813bcca6a2642117cdae498437fdfb6920a3faac5ddb
sources_digest: 7d0c820426784a2800f7a8127d726abc2d0a9a161ded240040d3b8cf19729562
links:
  - to: dataview-state-management
    relation: configures
    description: Colors are stored as part of workspace dataview instance configuration
  - to: layer-library-ui
    relation: implements
    description: Applies color assignments when users add layers from the library
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Automatic color palette management for new map layers, ensuring visual distinction and preventing conflicts. getNextColor selects from FILL_DATAVIEWS or line-based palettes, respects avoidColors exclusions, and persists assignments to workspace state. Hardcoded layer IDs bypass customization to maintain consistent styling.

## Related

- configures [[dataview-state-management]] — Colors are stored as part of workspace dataview instance configuration
- implements [[layer-library-ui]] — Applies color assignments when users add layers from the library

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
