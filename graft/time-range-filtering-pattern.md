---
name: Time-Range Filtering Pattern
slug: time-range-filtering-pattern
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx
    hash: 9ed14d1dcfa8ae4d9cdeecb65ea5d10e6e29259e14635393c22647f7f79e4b5b
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedGeartype.tsx
    hash: f2dc82f1adb93a7393515d2546bb14b920971cf2733d8624cf6d7759f58edda7
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedVesseltype.tsx
    hash: 2395fa9cca00a0372f6885afbb53bde4d6fabc15d26c41575fe66b26b72c0b19
  - path: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx
    hash: f916cc9b51eb27dfdf017e2d5b6548d84e486d520d4eeee6acb2736dd6ddf4cc
  - path: apps/platform/features/_vessels/vessel/identity/vessel-identity.utils.ts
    hash: 5a0f1600b728fe49da4b4ada1867fc897ad4ce75fef5bb8a47c7d9d3ff2c47c8
  - path: apps/platform/features/_vessels/vessel/identity/VesselIdentitySelector.tsx
    hash: f5be315377ccd49fed64505f7e41759d42bdac5e2cb861b9dc37b9df817b70da
sources_digest: 3a0fc29a7f11d6ad656dc88d6c617714a499b331ee6fb1522cfc697409e2f8ad
links:
  - to: vessel-identity-display-system
    relation: part_of
    description: >-
      All identity tabs implement time-range validation to ensure displayed data
      is temporally valid
generator:
  version: 1
covers:
  - symbol: VesselIdentitySelector
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/VesselIdentitySelector.tsx:L27-L97
  - symbol: setIdentityId
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/VesselIdentitySelector.tsx:L42-L56
  - symbol: VesselIdentityFieldsProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L30-L39
  - symbol: CombinedSourceValueField
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L41-L41
  - symbol: resolveFieldValue
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L43-L76
  - symbol: VesselIdentityFields
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx:L78-L159
  - symbol: VesselIdentityGFWExtendedGeartypeProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedGeartype.tsx:L20-L23
  - symbol: VesselIdentityGFWExtendedGeartype
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedGeartype.tsx:L24-L119
  - symbol: VesselIdentityGFWExtendedVesseltypeProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedVesseltype.tsx:L16-L19
  - symbol: VesselIdentityGFWExtendedVesseltype
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedVesseltype.tsx:L20-L83
  - symbol: RegistryIdentityTab
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx:L20-L64
  - symbol: isRegistryInTimerange
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/vessel-identity.utils.ts:L5-L11
---

<!-- context:generated:start -->

## Summary

Core design pattern ensuring vessel identity data is validated against transmission date ranges, preventing stale or pre-transmission records from being displayed. Uses Luxon DateTime interval intersection logic to check if vessel registry/identity periods overlap with query time windows. Critical constraint: must never display identity data outside its valid transmission period.

## Related

- part of [[vessel-identity-display-system]] — All identity tabs implement time-range validation to ensure displayed data is temporally valid

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
