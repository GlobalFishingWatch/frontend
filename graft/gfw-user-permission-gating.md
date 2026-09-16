---
name: GFW User Permission Gating
slug: gfw-user-permission-gating
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedGeartype.tsx
    hash: f2dc82f1adb93a7393515d2546bb14b920971cf2733d8624cf6d7759f58edda7
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityGFWExtendedVesseltype.tsx
    hash: 2395fa9cca00a0372f6885afbb53bde4d6fabc15d26c41575fe66b26b72c0b19
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryField.tsx
    hash: e621f8d4ce9a0af158b7fc21d2d9c343124461fdc3bc310a2d78d786fb88e9cc
  - path: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx
    hash: f916cc9b51eb27dfdf017e2d5b6548d84e486d520d4eeee6acb2736dd6ddf4cc
sources_digest: 8f3c539df289c24f7348ebf4f10c14e627ad080a53ec78314339ae089cbb4e2f
links:
  - to: vessel-identity-display-system
    relation: part_of
    description: >-
      Authentication gating is applied at field and tab levels throughout the
      identity display system
generator:
  version: 1
covers:
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
  - symbol: RegistryOperatorField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryField.tsx:L25-L58
  - symbol: VesselRegistryField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryField.tsx:L59-L198
  - symbol: RegistryIdentityTab
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx:L20-L64
---

<!-- context:generated:start -->

## Summary

Design pattern restricting sensitive vessel data to authenticated GFW and JAC users, enforcing access control at component level using selectIsGFWUser and selectIsJACUser selectors. Components return null or display login prompts for unauthorized access. Key constraint: GFW-extended vessel type/gear components MUST return null if user lacks GFW/JAC permission.

## Related

- part of [[vessel-identity-display-system]] — Authentication gating is applied at field and tab levels throughout the identity display system

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
