---
name: Vessels Section Management
slug: vessels-section-management
type: system
sources:
  - path: apps/platform/features/_map/workspace/vessels/VesselsFromPositions.tsx
    hash: e5d8192c54f2d3c44b6280b064cee6cad019934d468af138bd552ea045577abd
  - path: apps/platform/features/_map/workspace/vessels/VesselsSection.tsx
    hash: d832becf0a90ea16ff6eb80b061a0cacc79fe2ed3c80138c18c22095a1bd5e31
  - path: apps/platform/features/_map/workspace/vessels/VesselTracksLegend.tsx
    hash: f6273582580c5ae071f0026aff798bb9a976a1ac8d1f5f53118c92e6b484b856
sources_digest: c089a693833ddf6f7a53c408031a491de25610408608324c22365c8335af9d4f
links:
  - to: vessel-event-visibility-control
    relation: uses
    description: Conditionally displays VesselEventsLegend when vessel events are active
  - to: vessel-tracking-and-metadata
    relation: uses
    description: >-
      Renders VesselLayerPanel for each tracked vessel with coordinate
      visibility toggling
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      VesselsSection uses dataview instance callbacks to manage vessel layer
      visibility and deletion
generator:
  version: 1
covers:
  - symbol: VesselTracksLegend
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselTracksLegend.tsx:L15-L50
  - symbol: VesselFromPosition
    kind: type
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselsFromPositions.tsx:L34-L39
  - symbol: VesselsFromPositions
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselsFromPositions.tsx:L41-L200
  - symbol: setHighlightVessel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselsFromPositions.tsx:L58-L73
  - symbol: getVesselResourceByDataviewId
    kind: function
    at: 'apps/platform/features/_map/workspace/vessels/VesselsSection.tsx:L62-L68'
  - symbol: VesselsSection
    kind: function
    at: 'apps/platform/features/_map/workspace/vessels/VesselsSection.tsx:L70-L333'
---

<!-- context:generated:start -->

## Summary

VesselsSection component that renders a collapsible section for managing multiple vessel dataviews with drag-and-drop reordering via SortableContext. Orchestrates bulk operations: toggle all vessel visibility, delete all vessels, add visible vessels to groups, alphabetically sort by ship name, and navigate to vessel search. Displays VesselLayerPanel children for each dataview, with VesselTracksLegend and VesselEventsLegend conditionally rendered when vessels are active. Integrates resource lookup to fetch vessel metadata and respects read-only workspace and guest user permissions.

## Related

- uses [[vessel-event-visibility-control]] — Conditionally displays VesselEventsLegend when vessel events are active
- uses [[vessel-tracking-and-metadata]] — Renders VesselLayerPanel for each tracked vessel with coordinate visibility toggling
- uses [[workspace-dataview-instance-management]] — VesselsSection uses dataview instance callbacks to manage vessel layer visibility and deletion

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
