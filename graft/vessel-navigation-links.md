---
name: Vessel Navigation Links
slug: vessel-navigation-links
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/related-vessels/RelatedVessel.tsx
    hash: c280a496085b56578189a8136529f4ece5a673aeaa341b6005cc02c986552069
  - path: apps/platform/features/_vessels/vessel/VesselLink.tsx
    hash: 80d653f76e0d1206b2690a9fb124041e3e6cd326b2d4e9f1537d8d32e76b5a3f
  - path: apps/platform/features/_vessels/vessel/VesselPin.tsx
    hash: b729d586c8a16b9d7a355c8432b3a5e4496b9bdaefccdc80c5b6c212ebabaaa8
sources_digest: 5d15f68351dd9e4085685e954ac66036e375acc686983bfc6bf91991b2e99f62
links:
  - to: related-vessels-feature
    relation: part_of
    description: RelatedVessel renders individual vessel links within related vessel lists
  - to: vessel-identity-resolution
    relation: uses
    description: >-
      Accesses vessel identity data to construct labels and navigate with
      correct dataset context
  - to: vessel-workspace-integration
    relation: uses
    description: >-
      VesselPin and VesselLink dispatch dataview instance changes to add/remove
      vessels from workspace
generator:
  version: 1
covers:
  - symbol: VesselLinkProps
    kind: type
    at: 'apps/platform/features/_vessels/vessel/VesselLink.tsx:L42-L57'
  - symbol: VesselLink
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselLink.tsx:L58-L226'
  - symbol: VesselPinProps
    kind: type
    at: 'apps/platform/features/_vessels/vessel/VesselPin.tsx:L19-L24'
  - symbol: VesselPin
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselPin.tsx:L26-L75'
  - symbol: RelatedVessel
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedVessel.tsx:L17-L57
---

<!-- context:generated:start -->

## Summary

Reusable components for rendering navigable links to vessel profiles. VesselLink constructs dataview instances, selects route context (standalone vs workspace), dispatches vessel state reset and event selection, and handles analytics tracking. VesselPin wraps usePinVessel hook to toggle vessel presence in workspace, displaying filled/outline icon. Both respect track-correction mode by disabling navigation during corrections. RelatedVessel renders vessel name-flag pairs with optional VesselPin and responsive truncation tooltips.

## Related

- part of [[related-vessels-feature]] — RelatedVessel renders individual vessel links within related vessel lists
- uses [[vessel-identity-resolution]] — Accesses vessel identity data to construct labels and navigate with correct dataset context
- uses [[vessel-workspace-integration]] — VesselPin and VesselLink dispatch dataview instance changes to add/remove vessels from workspace

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
