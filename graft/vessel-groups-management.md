---
name: Vessel Groups Management
slug: vessel-groups-management
type: system
sources:
  - path: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupNotFound.tsx
    hash: d19c7f70750be5ee3affc0519655d616252605e63b10f77efefbdfff6c996fb0
  - path: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx
    hash: 655d0f44d5b3b02fbfb1003b538c5220f5198c676a096e3c5e2e3854667052f5
  - path: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsSection.tsx
    hash: b4babda771ecd1b81cc029a57ade3bb0edbeee565fd64171592945397e469e50
sources_digest: 732f1e6c05ef5fd153a0b03d6d97a52bedbf92010cc167483e6081bc325d784b
links:
  - to: layer-visibility-toggling
    relation: uses
    description: Uses LayerSwitch and Title components for vessel group visibility
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      VesselGroupsLayerPanel coordinates visibility and color updates through
      dataview instance management
  - to: workspace-persistence-and-migration
    relation: uses
    description: >-
      VesselGroupsLayerPanel triggers deprecation migration via
      useMigrateToLatestVesselGroup and persists changes via
      updateCurrentWorkspaceThunk
generator:
  version: 1
covers:
  - symbol: VesselGroupNotFound
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupNotFound.tsx:L11-L27
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
  - symbol: VesselGroupSection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessel-groups/VesselGroupsSection.tsx:L35-L134
---

<!-- context:generated:start -->

## Summary

VesselGroupsSection and VesselGroupsLayerPanel components that render collapsible sections for displaying and managing vessel group dataviews with drag-and-drop reordering. Coordinates visibility toggling, color customization, deprecation warnings, and layer deletion. Includes migration logic via useMigrateToLatestVesselGroup to upgrade outdated groups, conditional warning states for deleted datasets vs deprecated layers vs load errors, and lazy bounding-box fetching via fitBoundsClicked state.

## Related

- uses [[layer-visibility-toggling]] — Uses LayerSwitch and Title components for vessel group visibility
- uses [[workspace-dataview-instance-management]] — VesselGroupsLayerPanel coordinates visibility and color updates through dataview instance management
- uses [[workspace-persistence-and-migration]] — VesselGroupsLayerPanel triggers deprecation migration via useMigrateToLatestVesselGroup and persists changes via updateCurrentWorkspaceThunk

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
