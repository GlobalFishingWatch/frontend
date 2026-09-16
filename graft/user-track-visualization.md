---
name: User Track Visualization
slug: user-track-visualization
type: system
sources:
  - path: apps/platform/features/_map/workspace/user/user-layer-track-panel.hooks.ts
    hash: 57ac112c094d11f3efc34ebc20e09248cbbb5bf164a548e16b868c462133fc6b
  - path: apps/platform/features/_map/workspace/user/UserLayerPanel.tsx
    hash: bb1ac27e13ae03fadc0049b5de4fb27340d28617cf3546fc7ccb8594169cb2cd
  - path: apps/platform/features/_map/workspace/user/UserLayerTrackPanel.tsx
    hash: 676926dc29baabaaf08d11c1e231d0222f606daaea23c910198a4ec297996366
sources_digest: f0e7867875ec57bcfd231e6a7dacca44c52f7528fb1f26df14746a0eb40844cc
links:
  - to: workspace-dataview-instance-management
    relation: depends_on
    description: >-
      UserLayerTrackPanel extracts features from deck layer instances managed by
      workspace dataview state
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
  - symbol: UserPanelProps
    kind: type
    at: 'apps/platform/features/_map/workspace/user/UserLayerTrackPanel.tsx:L22-L25'
  - symbol: getFeatureTimeExtent
    kind: function
    at: 'apps/platform/features/_map/workspace/user/UserLayerTrackPanel.tsx:L29-L46'
  - symbol: UserLayerTrackPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/user/UserLayerTrackPanel.tsx:L48-L128
  - symbol: useUserLayerMetadata
    kind: function
    at: >-
      apps/platform/features/_map/workspace/user/user-layer-track-panel.hooks.ts:L15-L46
---

<!-- context:generated:start -->

## Summary

UserLayerTrackPanel and useUserLayerMetadata hook that display individual user-tracked features (vessel tracks, movement paths) within map workspace. Extracts time-range data from coordinate properties via COORDINATE_PROPERTY_TIMESTAMP constant and enables time-aware interactions through setHighlightedTime/dispatchDisableHighlightedTime timebar dispatch. Deduplicates features via uniqBy and respects dataview filter configuration. Returns null if features lack color-field data, requiring upstream preparation.

## Related

- depends on [[workspace-dataview-instance-management]] — UserLayerTrackPanel extracts features from deck layer instances managed by workspace dataview state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
