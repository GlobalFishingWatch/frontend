---
name: Vessel Config and State Types
slug: vessel-config-and-state-types
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel.config.ts
    hash: 9ab4042d8da2cff6a295d74ad6a3f66e63a6504cc83c432992c05d8ff948e18b
  - path: apps/platform/features/_vessels/vessel/vessel.types.ts
    hash: 9d4e8d3404480143bb0f6c8f2b8e75ae19b2bc7431d5d6d25e6dbe006b1cef92
sources_digest: f4996d83d868ef3843a24c9bccc0cbd4516ea49ac0e2619c82b758c852abc5fe
links:
  - to: vessel-identity-resolution
    relation: uses
    description: VesselProfileState includes vessel identity source and dataset selections
  - to: vessel-profile-core
    relation: implements
    description: >-
      Provides type definitions and configuration consumed throughout vessel
      profile feature
generator:
  version: 1
covers:
  - symbol: ActivityEventSubType
    kind: enum
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L3-L6'
  - symbol: ActivityEvent
    kind: interface
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L7-L10'
  - symbol: VesselEvent
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L12-L12'
  - symbol: VesselSection
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L15-L15'
  - symbol: VesselAreaSubsection
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L17-L17'
  - symbol: VesselRelatedSubsection
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L19-L19'
  - symbol: VesselProfileActivityMode
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L21-L21'
  - symbol: VesselProfileState
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L26-L58'
  - symbol: VesselProfileStateProperty
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.types.ts:L60-L60'
---

<!-- context:generated:start -->

## Summary

Type definitions and configuration constants for vessel profile feature. VesselProfileState encompasses URL query parameters (dataset identity, tab selection, subsection choices, display modes). ActivityEvent, VesselEvent extend ApiEvent with voyage tracking and dataset identification. Supporting enums (VesselSection, VesselAreaSubsection, VesselRelatedSubsection) define discrete options with type-safe iteration via const assertions. Configuration exports dataset IDs, default state, and region prioritization (MPA > EEZ > FAO > RFMO).

## Related

- uses [[vessel-identity-resolution]] — VesselProfileState includes vessel identity source and dataset selections
- implements [[vessel-profile-core]] — Provides type definitions and configuration consumed throughout vessel profile feature

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
