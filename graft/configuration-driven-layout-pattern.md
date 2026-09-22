---
name: Configuration-Driven Layout Pattern
slug: configuration-driven-layout-pattern
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityFields.tsx
    hash: 9ed14d1dcfa8ae4d9cdeecb65ea5d10e6e29259e14635393c22647f7f79e4b5b
  - path: apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabAIS.tsx
    hash: 69677d3b111cd235c16fe57a6a9fbb48107ea282dd39c5bb3c126f70a1ebab1b
  - path: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx
    hash: f916cc9b51eb27dfdf017e2d5b6548d84e486d520d4eeee6acb2736dd6ddf4cc
  - path: apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabVMS.tsx
    hash: 5279f756ae9090cebd90759c5be7df06fa90cec12ff85ae57a29b659433e4b5a
  - path: apps/platform/features/_vessels/vessel/identity/vessel-identity.config.ts
    hash: 549dea657541b5394db8536e4edde8772a86c45611394b25c6579e2a2baf70ae
sources_digest: 6b050a6a4e78454522a0a93b839c9eb10358be34870f6432e647e2caf5a493e5
links:
  - to: vessel-identity-display-system
    relation: part_of
    description: >-
      Central configuration enables flexible, declarative UI composition across
      all identity tabs
generator:
  version: 1
covers:
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
  - symbol: AISIdentityTab
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabAIS.tsx:L13-L35
  - symbol: RegistryIdentityTab
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx:L20-L64
  - symbol: VMSIdentityTab
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabVMS.tsx:L22-L69
  - symbol: VesselRenderField
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/vessel-identity.config.ts:L6-L11
  - symbol: CustomVMSGroup
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/vessel-identity.config.ts:L85-L90
  - symbol: IdentitySection
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/vessel-identity.config.ts:L140-L147
---

<!-- context:generated:start -->

## Summary

Design pattern decoupling identity field display logic from data fetching by defining field layouts, sections, and field-to-data-key mappings in central configuration (vessel-identity.config.ts). Enables UI changes without code modifications and supports source-specific variants (AIS, Registry, VMS) plus country-specific custom fields for VMS. Configuration defines field structure as 2D arrays (rows × fields), optional terminology keys for CMS links, and source identifiers including private dataset suffixes.

## Related

- part of [[vessel-identity-display-system]] — Central configuration enables flexible, declarative UI composition across all identity tabs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
