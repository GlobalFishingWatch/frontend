---
name: User-uploaded Dataset Management
slug: user-uploaded-dataset-management
type: system
sources:
  - path: apps/platform/features/_map/workspace/user/UserLayerPanel.tsx
    hash: bb1ac27e13ae03fadc0049b5de4fb27340d28617cf3546fc7ccb8594169cb2cd
  - path: >-
      apps/platform/features/_map/workspace/user/UserSection/UserSection.test.tsx
    hash: f9879490f217f0c1dfc427056e9614b49e166cff54d29af6ab60378e84682538
  - path: apps/platform/features/_map/workspace/user/UserSection/UserSection.tsx
    hash: ad761b94325331da687ff3357ab95bf929a5e6e6324549bb2a993272b3d17a13
sources_digest: 86e808df29b768fec23e87edc33c27de9ef1b08d13e049d38df09f55576a56f6
links:
  - to: layer-property-customization
    relation: uses
    description: >-
      UserLayerPanel provides color picker and thickness customization for user
      layers
  - to: layer-visibility-toggling
    relation: uses
    description: Uses LayerSwitch and Title components for user dataset visibility
  - to: schema-based-filtering
    relation: uses
    description: UserLayerPanel exposes schema filter controls for user-uploaded datasets
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      UserLayerPanel coordinates layer visibility, color, and filter updates
      through upsertDataviewInstance
generator:
  version: 1
covers:
  - symbol: UserPanelProps
    kind: type
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L68-L72'
  - symbol: UserPanel
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L74-L412'
  - symbol: changeColor
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L132-L141'
  - symbol: changeThickness
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L142-L150'
  - symbol: onEditClick
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L152-L166'
  - symbol: onToggleColorOpen
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L167-L169'
  - symbol: onToggleFilterOpen
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L171-L173'
  - symbol: closeExpandedContainer
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerPanel.tsx:L175-L178'
  - symbol: RegisterOrLoginToUpload
    kind: function
    at: >-
      apps/platform/features/_map/workspace/user/UserSection/UserSection.tsx:L36-L52
  - symbol: UserSection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/user/UserSection/UserSection.tsx:L54-L224
---

<!-- context:generated:start -->

## Summary

UserLayerPanel and UserSection components that render control panels for user-uploaded geospatial datasets (tracks, points, gridded data). Coordinates visibility toggling, geometry editing, color/thickness customization, schema-based filtering, and layer removal. UserSection provides bulk operations including upload, draw polygon/point, and layer library browsing, with drag-and-drop reordering via SortableContext. Respects guest user authentication status and dataset ownership for permissions.

## Related

- uses [[layer-property-customization]] — UserLayerPanel provides color picker and thickness customization for user layers
- uses [[layer-visibility-toggling]] — Uses LayerSwitch and Title components for user dataset visibility
- uses [[schema-based-filtering]] — UserLayerPanel exposes schema filter controls for user-uploaded datasets
- uses [[workspace-dataview-instance-management]] — UserLayerPanel coordinates layer visibility, color, and filter updates through upsertDataviewInstance

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
