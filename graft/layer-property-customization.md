---
name: Layer Property Customization
slug: layer-property-customization
type: concept
sources:
  - path: apps/platform/features/_map/workspace/shared/LayerSwitch.tsx
    hash: 11822d8b30adcdb23d8299bdcc125eb0de393c3dd80fa389b0e3a3b42c792741
  - path: apps/platform/features/_map/workspace/user/UserLayerPanel.tsx
    hash: bb1ac27e13ae03fadc0049b5de4fb27340d28617cf3546fc7ccb8594169cb2cd
  - path: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx
    hash: 655d0f44d5b3b02fbfb1003b538c5220f5198c676a096e3c5e2e3854667052f5
  - path: apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx
    hash: d48ebcbd9374a3c9a613f521b7099d01b20c9c4774a434ce64879bacceb9f793
sources_digest: 70e743ef37f35394549800da3f281a2ca9110ba634d30f68fc58c5b01665440f
links:
  - to: workspace-dataview-instance-management
    relation: implements
    description: >-
      Color cycling from LAYERS_LIBRARY_* palettes is implemented during
      dataview creation via createDataviewsInstances
generator:
  version: 1
covers:
  - symbol: LayerSwitchProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L10-L18'
  - symbol: LayerSwitch
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L20-L57'
  - symbol: onToggleLayerActive
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L33-L44'
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
  - symbol: VesselGroupLayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx:L48-L51
  - symbol: VesselGroupLayerPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx:L53-L313
  - symbol: changeInstanceColor
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx:L103-L112
  - symbol: onEditClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx:L114-L123
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx:L125-L127
  - symbol: closeExpandedContainer
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx:L129-L131
  - symbol: onUpdateDeprecatedLayerClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx:L133-L135
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
---

<!-- context:generated:start -->

## Summary

Design pattern where dataviews expose customizable visual properties (color, thickness) stored in config and synchronized through upsertDataviewInstance. Color selection defaults to predefined cycling library values if not explicitly set. This enables consistent visual binding between layer controls and rendered map features across nested UI hierarchies.

## Related

- implements [[workspace-dataview-instance-management]] — Color cycling from LAYERS_LIBRARY_* palettes is implemented during dataview creation via createDataviewsInstances

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
