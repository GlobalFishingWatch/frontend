---
name: Dataview Composition and Resolution
slug: dataview-composition-and-resolution
type: concept
sources:
  - path: apps/platform/features/_map/workspace/user/user-layer-track-panel.hooks.ts
    hash: 57ac112c094d11f3efc34ebc20e09248cbbb5bf164a548e16b868c462133fc6b
  - path: apps/platform/features/_map/workspace/user/UserLayerPanel.tsx
    hash: bb1ac27e13ae03fadc0049b5de4fb27340d28617cf3546fc7ccb8594169cb2cd
  - path: apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx
    hash: d48ebcbd9374a3c9a613f521b7099d01b20c9c4774a434ce64879bacceb9f793
  - path: apps/platform/features/_map/workspace/vessels/VesselsSection.tsx
    hash: d832becf0a90ea16ff6eb80b061a0cacc79fe2ed3c80138c18c22095a1bd5e31
sources_digest: b75f45f69615dac5be605a3de7e31d811fc431e0d82b8e3537f99a29e42e991f
links:
  - to: workspace-dataview-instance-management
    relation: implements
    description: >-
      Dataview instances are created, updated, and deleted through workspace
      instance management hooks
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
  - symbol: useUserLayerMetadata
    kind: function
    at: >-
      apps/platform/features/_map/workspace/user/user-layer-track-panel.hooks.ts:L15-L46
  - symbol: VesselLayerPanelProps
    kind: type
    at: 'apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx:L59-L63'
  - symbol: VesselLayerPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx:L65-L377
  - symbol: changeTrackColor
    kind: function
    at: 'apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx:L91-L99'
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx:L101-L103
  - symbol: onToggleFilterOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx:L105-L107
  - symbol: closeExpandedContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx:L109-L113
  - symbol: getVesselTitle
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx:L150-L174
  - symbol: getVesselResourceByDataviewId
    kind: function
    at: 'apps/platform/features/_map/workspace/vessels/VesselsSection.tsx:L62-L68'
  - symbol: VesselsSection
    kind: function
    at: 'apps/platform/features/_map/workspace/vessels/VesselsSection.tsx:L70-L333'
---

<!-- context:generated:start -->

## Summary

Pattern where dataviews (configuration objects) are resolved via Redux selectors and deck-layer-composer to fetch underlying deck layer instances and their rendering state. Dataviews contain config.visible, config.color, config.filters, and linked dataset IDs. Layer instances expose methods like getViewportData() for positions and getLegend() for styling metadata. Resource state maps link dataview IDs to resolved dataset objects containing vessel metadata, dataset type, and permissions.

## Related

- implements [[workspace-dataview-instance-management]] — Dataview instances are created, updated, and deleted through workspace instance management hooks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
