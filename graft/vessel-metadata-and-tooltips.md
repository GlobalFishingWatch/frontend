---
name: Vessel Metadata and Tooltips
slug: vessel-metadata-and-tooltips
type: system
sources:
  - path: apps/platform/features/_map/workspace/vessels/vessel-layer-panel.utils.tsx
    hash: 48449392a08210d2963f6780e481456915a3d67f200644e74dc4d3538f74d0da
  - path: apps/platform/features/_map/workspace/vessels/VesselInfoCorrection.tsx
    hash: fefe01582d4133fc9e2b121a5b3d3e59841c08a73eb74f1f8fb06a6e17d8c739
sources_digest: 72edb6cc84c3f57f06c1a4616204b9a2fe96b51adf8ae4954ac7e4da00fd4f61
links:
  - to: vessel-tracking-and-metadata
    relation: uses
    description: >-
      VesselLayerPanel displays vessel metadata summaries via
      getVesselIdentityTooltipSummary utility
generator:
  version: 1
covers:
  - symbol: VesselInfoCorrection
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/VesselInfoCorrection.tsx:L12-L37
  - symbol: getVesselIdentityTooltipSummary
    kind: function
    at: >-
      apps/platform/features/_map/workspace/vessels/vessel-layer-panel.utils.tsx:L12-L65
---

<!-- context:generated:start -->

## Summary

Utility functions and components (getVesselIdentityTooltipSummary, VesselInfoCorrection) that format and display vessel identity information in tooltips. Consolidates self-reported vessel identities by normalized ship name, aggregates transmission date ranges, and conditionally gates vessel IDs behind GFW-only permission checks via the GFWOnly component. Includes error reporting UI for vessel information corrections dispatched to modals system.

## Related

- uses [[vessel-tracking-and-metadata]] — VesselLayerPanel displays vessel metadata summaries via getVesselIdentityTooltipSummary utility

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
