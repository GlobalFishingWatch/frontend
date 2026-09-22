---
name: Vessel Profile Core
slug: vessel-profile-core
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/Vessel.tsx
    hash: b540a06a14204ea0bc73466b901476dd16e1a7ae739917d2a648fa334d1d4f8f
  - path: apps/platform/features/_vessels/vessel/VesselHeader.tsx
    hash: 797c9fb8d56425805712637f9b6be6332bc4d4e9bb5fdbcea6b6d90faec9c9fc
  - path: apps/platform/features/_vessels/vessel/VesselSubHeader.tsx
    hash: 43156597fe07ae9b4ad015f6fe57b8b4a1c78abda4157cbc15207fad6617941b
sources_digest: 70b9c5479ff05ba5b3b99e7f49ce97deb3bba6138bae6b32eac48f6e45c672d3
links:
  - to: related-vessels-feature
    relation: uses
    description: Renders RelatedVessels tab showing encounter and owner networks
  - to: vessel-bounds-and-time-synchronization
    relation: depends_on
    description: >-
      Uses useVesselFitBounds to auto-adjust viewport and timerange when loading
      vessel profiles from external links
  - to: vessel-identity-resolution
    relation: uses
    description: >-
      Uses vessel.utils and vessel.config.selectors to determine which identity
      (registry vs self-reported) to display and resolve identity across
      multiple sources
  - to: vessel-insights-visualization
    relation: uses
    description: >-
      Renders VesselAreas (geospatial) and Insights (longline patterns) tabs
      using structured event data
  - to: vessel-layout-and-visualization
    relation: uses
    description: >-
      Renders vessel header with images, identity details, action buttons;
      orchestrates bounds fitting and layer visibility via hooks
  - to: vessel-redux-state-management
    relation: uses
    description: >-
      Depends on vessel.slice thunks and selectors to fetch vessel info, manage
      events, and track UI state like print mode and selected events
generator:
  version: 1
covers:
  - symbol: Vessel
    kind: function
    at: 'apps/platform/features/_vessels/vessel/Vessel.tsx:L72-L277'
  - symbol: fetchVesselProfileAreaDatasets
    kind: function
    at: 'apps/platform/features/_vessels/vessel/Vessel.tsx:L188-L200'
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

The main vessel detail view orchestrating tabs for activity, areas, related vessels, and insights. Manages data fetching via Redux thunks (fetchVesselInfoThunk, fetchDataviewsByIdsThunk), tab navigation with URL sync, and conditional rendering based on dataset availability and user permissions. Integrates layer visibility toggling, workspace login checks, and analytics tracking.

## Related

- uses [[related-vessels-feature]] — Renders RelatedVessels tab showing encounter and owner networks
- depends on [[vessel-bounds-and-time-synchronization]] — Uses useVesselFitBounds to auto-adjust viewport and timerange when loading vessel profiles from external links
- uses [[vessel-identity-resolution]] — Uses vessel.utils and vessel.config.selectors to determine which identity (registry vs self-reported) to display and resolve identity across multiple sources
- uses [[vessel-insights-visualization]] — Renders VesselAreas (geospatial) and Insights (longline patterns) tabs using structured event data
- uses [[vessel-layout-and-visualization]] — Renders vessel header with images, identity details, action buttons; orchestrates bounds fitting and layer visibility via hooks
- uses [[vessel-redux-state-management]] — Depends on vessel.slice thunks and selectors to fetch vessel info, manage events, and track UI state like print mode and selected events

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
