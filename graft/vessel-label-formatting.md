---
name: Vessel Label Formatting
slug: vessel-label-formatting
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/vessel-label.utils.ts
    hash: 440313c907aa52f5d5faf0aa0d660b94f711e9e93b5bedb64cba09eab3e5004b
sources_digest: 7d82eea893ff08ee0d7b9b54a5d4c4d28f120816646011b285866b3d33b9a9a1
links:
  - to: vessel-identity-resolution
    relation: uses
    description: Calls getLatestIdentityPrioritised to extract display identity
  - to: vessel-layout-and-visualization
    relation: implements
    description: Used by header and related vessel components for consistent label display
generator:
  version: 1
covers:
  - symbol: getVesselShipNameLabel
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-label.utils.ts:L16-L42'
---

<!-- context:generated:start -->

## Summary

Consistent display label generation for vessel entities across UI. getVesselShipNameLabel composes ship name, flag, and optional gear types with multilingual support via i18n, falling back to 'unknown vessel'. Deliberately resides in features layer rather than shared utils to avoid pulling @globalfishingwatch/deck-layers dependency into landing page entry chunk (per scripts/check-store-graph.mjs constraint). Supports flexible labeling contexts via optional translationFn and withGearType parameters.

## Related

- uses [[vessel-identity-resolution]] — Calls getLatestIdentityPrioritised to extract display identity
- implements [[vessel-layout-and-visualization]] — Used by header and related vessel components for consistent label display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
