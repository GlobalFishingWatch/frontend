---
name: Vessel Tracking and Metadata
slug: vessel-tracking-and-metadata
type: system
sources:
  - path: apps/platform/features/_map/workspace/vessels/VesselDownload.tsx
    hash: add7c0edd2af6d7ef5d1c2b4c0b9c6bcd93d3db8943f4339cfbf38eaad94a889
  - path: apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx
    hash: d48ebcbd9374a3c9a613f521b7099d01b20c9c4774a434ce64879bacceb9f793
sources_digest: bfc7892dfb4cf02c010c98d058f1847430b533a36157c2dfd693357e4e2cd04f
links:
  - to: layer-property-customization
    relation: uses
    description: >-
      VesselLayerPanel exposes color picker and filter controls for customizing
      vessel layer appearance
  - to: layer-visibility-toggling
    relation: uses
    description: Uses LayerSwitch and Title components to toggle vessel visibility
  - to: vessel-event-visibility-control
    relation: depends_on
    description: >-
      Vessel layer panel coordinates with vessel events system to display event
      legends and toggle event types
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      VesselLayerPanel coordinates layer visibility, color, and filter updates
      through upsertDataviewInstance
generator:
  version: 1
covers:
  - symbol: VesselDownloadButtonProps
    kind: type
    at: 'apps/platform/features/_map/workspace/vessels/VesselDownload.tsx:L14-L19'
  - symbol: VesselDownloadButton
    kind: function
    at: 'apps/platform/features/_map/workspace/vessels/VesselDownload.tsx:L21-L68'
  - symbol: onDownloadClick
    kind: function
    at: 'apps/platform/features/_map/workspace/vessels/VesselDownload.tsx:L37-L47'
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

VesselLayerPanel, VesselLink, and VesselPin components that render control panels and interactive UI for individual vessel tracking layers. Coordinates visibility toggling, color customization, speed/elevation filtering, track downloading, and map navigation. Integrates with Redux resource selectors to fetch vessel metadata (ship name, flag state) from resolved dataview dataset resources. Displays deprecation warnings and error states with conditional icon styling.

## Related

- uses [[layer-property-customization]] — VesselLayerPanel exposes color picker and filter controls for customizing vessel layer appearance
- uses [[layer-visibility-toggling]] — Uses LayerSwitch and Title components to toggle vessel visibility
- depends on [[vessel-event-visibility-control]] — Vessel layer panel coordinates with vessel events system to display event legends and toggle event types
- uses [[workspace-dataview-instance-management]] — VesselLayerPanel coordinates layer visibility, color, and filter updates through upsertDataviewInstance

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
