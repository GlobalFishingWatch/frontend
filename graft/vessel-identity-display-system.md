---
name: Vessel Identity Display System
slug: vessel-identity-display-system
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabAIS.tsx
    hash: 69677d3b111cd235c16fe57a6a9fbb48107ea282dd39c5bb3c126f70a1ebab1b
  - path: >-
      apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabRegistry.tsx
    hash: f916cc9b51eb27dfdf017e2d5b6548d84e486d520d4eeee6acb2736dd6ddf4cc
  - path: apps/platform/features/_vessels/vessel/identity/tabs/IdentityTabVMS.tsx
    hash: 5279f756ae9090cebd90759c5be7df06fa90cec12ff85ae57a29b659433e4b5a
  - path: apps/platform/features/_vessels/vessel/identity/vessel-identity.config.ts
    hash: 549dea657541b5394db8536e4edde8772a86c45611394b25c6579e2a2baf70ae
  - path: apps/platform/features/_vessels/vessel/identity/vessel-identity.hooks.tsx
    hash: b81824129b344383d62fbe9a0f0322219b94bf6f6c046816dc4d0c20437e5eff
  - path: apps/platform/features/_vessels/vessel/identity/VesselIdentity.tsx
    hash: 7a7734df89cefb40989727636ab24898026047a2e0584adc546cec6a96698471
sources_digest: 5e9f26282192543124251f4d9fc3ca66b3b55d9a5c4ce5dd5d2123a223d8a1b6
links:
  - to: configuration-driven-layout-pattern
    relation: depends_on
    description: >-
      Relies on vessel-identity.config for AIS_IDENTITY_LAYOUT,
      REGISTRY_IDENTITY_LAYOUT, VMS_BASE_IDENTITY_LAYOUT, and custom VMS field
      groups keyed by source
  - to: redux-state-selectors
    relation: depends_on
    description: >-
      Coordinates vessel identity source, identity ID, vessel info, and user
      permissions through selectVesselIdentitySource, selectVesselIdentityId,
      selectVesselInfoData
  - to: registry-data-access-filtering
    relation: uses
    description: >-
      IdentityTabWrapper and IdentityTabRegistry access registry data, filter by
      date ranges and SSVID, and export CSV
  - to: time-range-filtering-pattern
    relation: implements
    description: >-
      All tabs filter identity data by vessel transmission date ranges using
      isRegistryInTimerange and getIsCombinedSourceInTimerange
  - to: vessel-identity-field-rendering
    relation: uses
    description: >-
      Each identity tab delegates to field components to render structured field
      groups and sections
generator:
  version: 1
covers:
  - symbol: VesselIdentity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/identity/VesselIdentity.tsx:L14-L38'
  - symbol: onTabClick
    kind: function
    at: 'apps/platform/features/_vessels/vessel/identity/VesselIdentity.tsx:L19-L26'
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
  - symbol: useVesselIdentities
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/vessel-identity.hooks.tsx:L25-L36
  - symbol: useVesselIdentityTabs
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/vessel-identity.hooks.tsx:L38-L87
  - symbol: useVesselIdentityChoice
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/vessel-identity.hooks.tsx:L89-L110
---

<!-- context:generated:start -->

## Summary

Renders tabbed interfaces for viewing vessel identity information from multiple sources (AIS self-reported, registry, VMS), with conditional field visibility, formatting, and user authentication gating. Orchestrates configuration-driven layouts, Redux state, and specialized field components to present maritime identity attributes (ship type, gear type, registry details, operator info) across different data sources and time ranges.

## Related

- depends on [[configuration-driven-layout-pattern]] — Relies on vessel-identity.config for AIS_IDENTITY_LAYOUT, REGISTRY_IDENTITY_LAYOUT, VMS_BASE_IDENTITY_LAYOUT, and custom VMS field groups keyed by source
- depends on [[redux-state-selectors]] — Coordinates vessel identity source, identity ID, vessel info, and user permissions through selectVesselIdentitySource, selectVesselIdentityId, selectVesselInfoData
- uses [[registry-data-access-filtering]] — IdentityTabWrapper and IdentityTabRegistry access registry data, filter by date ranges and SSVID, and export CSV
- implements [[time-range-filtering-pattern]] — All tabs filter identity data by vessel transmission date ranges using isRegistryInTimerange and getIsCombinedSourceInTimerange
- uses [[vessel-identity-field-rendering]] — Each identity tab delegates to field components to render structured field groups and sections

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
