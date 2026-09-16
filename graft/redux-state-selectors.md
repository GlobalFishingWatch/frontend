---
name: Redux State & Selectors
slug: redux-state-selectors
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
  - path: apps/platform/features/_vessels/vessel/identity/vessel-identity.hooks.tsx
    hash: b81824129b344383d62fbe9a0f0322219b94bf6f6c046816dc4d0c20437e5eff
  - path: apps/platform/features/_vessels/vessel/identity/VesselIdentity.tsx
    hash: 7a7734df89cefb40989727636ab24898026047a2e0584adc546cec6a96698471
sources_digest: 94333d4eb5f062a424c6bcc20d420d558bfa688db79bd7b773b093c72817e5ae
links:
  - to: vessel-identity-display-system
    relation: part_of
    description: >-
      Redux integration provides the state backbone for tab management, field
      visibility, and user context
generator:
  version: 1
covers:
  - symbol: VesselIdentity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/identity/VesselIdentity.tsx:L14-L38'
  - symbol: onTabClick
    kind: function
    at: 'apps/platform/features/_vessels/vessel/identity/VesselIdentity.tsx:L19-L26'
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

Centralized state management pattern providing vessel identity metadata, user permissions, and pipeline configuration to identity components. Key selectors: selectVesselIdentitySource (current tab), selectVesselIdentityId (active identity record), selectVesselInfoData (vessel metadata), selectShowPipe5IdentityFields (feature flag), selectIsGFWUser/selectIsJACUser (permissions). Constraint: identity source and ID must be kept in sync with route query parameters via useReplaceQueryParams.

## Related

- part of [[vessel-identity-display-system]] — Redux integration provides the state backbone for tab management, field visibility, and user context

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
