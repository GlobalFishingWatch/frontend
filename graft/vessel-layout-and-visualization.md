---
name: Vessel Layout and Visualization
slug: vessel-layout-and-visualization
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/VesselHeader.tsx
    hash: 797c9fb8d56425805712637f9b6be6332bc4d4e9bb5fdbcea6b6d90faec9c9fc
  - path: apps/platform/features/_vessels/vessel/VesselSubHeader.tsx
    hash: 43156597fe07ae9b4ad015f6fe57b8b4a1c78abda4157cbc15207fad6617941b
sources_digest: a70b1c9d65b66c2cdd05b9541eaeac0301fb028ccda7bed1465fd91df866c97d
links:
  - to: vessel-bounds-and-time-synchronization
    relation: uses
    description: >-
      Uses useVesselProfileBounds from VesselHeader to fit map viewport to
      vessel data bounds
  - to: vessel-identity-resolution
    relation: uses
    description: >-
      Accesses vessel identity properties via getVesselProperty and
      getCurrentIdentityVessel utilities
  - to: vessel-profile-core
    relation: part_of
    description: Renders header and sub-header sections of the main vessel profile view
generator:
  version: 1
covers:
  - symbol: VesselHeader
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselHeader.tsx:L47-L278'
  - symbol: onAddToVesselGroup
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselHeader.tsx:L78-L85'
  - symbol: enableVesselPrintMode
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselHeader.tsx:L88-L91'
  - symbol: disableVesselPrintMode
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselHeader.tsx:L92-L94'
  - symbol: onVesselFitBoundsClick
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselHeader.tsx:L125-L129'
  - symbol: onPrintClick
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselHeader.tsx:L131-L135'
  - symbol: handleMouseMove
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselHeader.tsx:L137-L142'
  - symbol: VesselSubHeader
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselSubHeader.tsx:L27-L108'
---

<!-- context:generated:start -->

## Summary

Components rendering vessel profile header and sub-header with identity details, imagery, action buttons, and contextual banners. VesselHeader handles image carousel with zoom-on-hover, print workflow, bounds centering, and vessel group assignment. VesselSubHeader conditionally displays profile completion prompts and dataset version switchers. Both integrate Redux selectors for vessel data and use formatInfoField for consistent presentation.

## Related

- uses [[vessel-bounds-and-time-synchronization]] — Uses useVesselProfileBounds from VesselHeader to fit map viewport to vessel data bounds
- uses [[vessel-identity-resolution]] — Accesses vessel identity properties via getVesselProperty and getCurrentIdentityVessel utilities
- part of [[vessel-profile-core]] — Renders header and sub-header sections of the main vessel profile view

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
