---
name: Map Dataview Registry
slug: map-dataview-registry
type: system
sources:
  - path: apps/platform/data/map/dataviews.ts
    hash: e71bb074f453f607456eca0fa1eb3b93477b7c58785177b67e03b844dff17850
sources_digest: 3d859c5443de7b7ed8278fd22831c78d825d0e8535ab35a35099313b27593883
links:
  - to: platform-configuration
    relation: depends_on
    description: >-
      Registry imports slug constants from @platform/config/map/dataviews and
      maps them into functional collections
  - to: vms-dataset-versioning-constraint
    relation: implements
    description: >-
      Registry includes hardcoded exception for Panama VMS dataview (v-4-1) that
      must match API-returned slug exactly to prevent silent fallback to global
      templates
  - to: workspace-layer-library-defaults
    relation: uses
    description: >-
      Default workspace and layer library modules reference dataview registry
      collections to construct map layer instances
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Curated registry organizing dataview identifiers (layer definitions) by functional purpose: activity layers (AIS, VMS, presence), detection datasets (VIIRS, SAR, Sentinel-2), environmental data (bathymetry, currents), boundary layers (EEZ, MPA, RFMO), and event clusters (encounters, loitering, port visits, gaps). Enables dynamic layer population without hardcoding references throughout the codebase.

## Related

- depends on [[platform-configuration]] — Registry imports slug constants from @platform/config/map/dataviews and maps them into functional collections
- implements [[vms-dataset-versioning-constraint]] — Registry includes hardcoded exception for Panama VMS dataview (v-4-1) that must match API-returned slug exactly to prevent silent fallback to global templates
- uses [[workspace-layer-library-defaults]] — Default workspace and layer library modules reference dataview registry collections to construct map layer instances

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
