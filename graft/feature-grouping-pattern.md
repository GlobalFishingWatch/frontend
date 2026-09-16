---
name: Feature Grouping Pattern
slug: feature-grouping-pattern
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx
    hash: a0b9b55d7ebe8a64f35e4e5bf6fe836ab10fc657c7f306c93660bb4a3dca46a4
  - path: apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx
    hash: 8619bd4e73018a937c0eea57c016bdd1142da37df86b26c76bafc1deec63c536
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx
    hash: 6c7a7f2c3c494f282a88335f97b99548792d9f80ced722cc806cc8b5736e1357
  - path: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx
    hash: 8735f9853eef7c021109c8cd2011809b2d8bc4ef9a15e4d71f68eaaa0110ef57
sources_digest: 87de5214bc73af3726c3040503e8002b52d09313c8a7ed4427fbce6f3d1e20f4
links:
  - to: dataviews-datasets-state
    relation: uses
    description: >-
      After grouping, sections perform lookups via selectCustomUserDataviews and
      getDatasetLabel to attach metadata to each group
  - to: map-popup-system
    relation: implements
    description: >-
      All tooltip sections apply groupBy to organize features, then map group
      entries to PopupSectionLayout + row components
generator:
  version: 1
covers:
  - symbol: UserPointsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx:L16-L19
  - symbol: UserPointsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/user/UserPointsTooltipSection.tsx:L21-L62
  - symbol: UserTracksTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx:L15-L18
  - symbol: UserTracksTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/user/UserTracksTooltipSection.tsx:L20-L58
  - symbol: EventDescription
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx:L34-L113
  - symbol: VesselEventsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx:L115-L118
  - symbol: VesselEventsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselEventsTooltipSection.tsx:L120-L188
  - symbol: VesselTracksTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L44-L47
  - symbol: VesselTracksTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L49-L187
  - symbol: VesselTracksTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx:L189-L235
---

<!-- context:generated:start -->

## Summary

A consistent data organization pattern used across tooltip sections: features are grouped by a key (layerId, vesselId) using es-toolkit's groupBy, then rendered in hierarchical layouts with PopupSectionLayout containers and individual row components, supporting conditional detail expansion.

## Related

- uses [[dataviews-datasets-state]] — After grouping, sections perform lookups via selectCustomUserDataviews and getDatasetLabel to attach metadata to each group
- implements [[map-popup-system]] — All tooltip sections apply groupBy to organize features, then map group entries to PopupSectionLayout + row components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
