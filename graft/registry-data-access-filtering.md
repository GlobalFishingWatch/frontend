---
name: Registry Data Access & Filtering
slug: registry-data-access-filtering
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryContact.tsx
    hash: 585c639cc3758f10d47de279def7bfa2722118bb337610b76f56d4cd4aa797a3
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryField.tsx
    hash: e621f8d4ce9a0af158b7fc21d2d9c343124461fdc3bc310a2d78d786fb88e9cc
  - path: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx
    hash: f916cc9b51eb27dfdf017e2d5b6548d84e486d520d4eeee6acb2736dd6ddf4cc
sources_digest: 3f34b55e529b9cb97435c04928e9e5230490efe45b3d8cc8be435bb6db8c63e2
links:
  - to: configuration-driven-layout-pattern
    relation: depends_on
    description: >-
      IdentityTabRegistry iterates through REGISTRY_IDENTITY_LAYOUT sections and
      resolves REGISTRY_SOURCES for contact display
  - to: gfw-user-permission-gating
    relation: implements
    description: >-
      VesselRegistryField restricts recordId field display to GFW users only via
      selectIsGFWUser and GFWOnly wrapper
  - to: time-range-filtering-pattern
    relation: implements
    description: >-
      VesselRegistryField uses filterRegistryInfoByDateAndSSVID to exclude
      non-overlapping registry records
generator:
  version: 1
covers:
  - symbol: VesselRegistryContactProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryContact.tsx:L10-L12
  - symbol: VesselRegistryContact
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselRegistryContact.tsx:L14-L36
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

Handles querying, filtering, and displaying registry-sourced vessel identity information including operators, owners, authorizations, and record IDs. Filters registry data by transmission date range and SSVID, applies field-specific formatting, and enforces user permission restrictions (GFW-only for record IDs).

## Related

- depends on [[configuration-driven-layout-pattern]] — IdentityTabRegistry iterates through REGISTRY_IDENTITY_LAYOUT sections and resolves REGISTRY_SOURCES for contact display
- implements [[gfw-user-permission-gating]] — VesselRegistryField restricts recordId field display to GFW users only via selectIsGFWUser and GFWOnly wrapper
- implements [[time-range-filtering-pattern]] — VesselRegistryField uses filterRegistryInfoByDateAndSSVID to exclude non-overlapping registry records

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
