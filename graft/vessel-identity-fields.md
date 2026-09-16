---
name: Vessel Identity Fields
slug: vessel-identity-fields
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/vessel-identity.utils.ts
    hash: b0f364ca709b659ad22ca98226478db524785717ce8779f3a948cd406ea97fdd
  - path: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityCombinedSourceField.tsx
    hash: 9d3f80eb13f2d74642519117e9857c221d7bb875f98873cb7d6417a7d47a2096
sources_digest: fcf447b5ede19f6a57d38b7590c14162bff4ff9cfd0f0873a5662494b64e317d
links:
  - to: guest-permission-guards
    relation: uses
    description: >-
      VesselIdentityCombinedSourceField gates extended detail views to GFW users
      via selectIsGFWUser
  - to: redux-state-selectors-pattern
    relation: uses
    description: Depends on Redux selectors to fetch combined source info and user tier
generator:
  version: 1
covers:
  - symbol: VesselIdentityCombinedSourceFieldProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityCombinedSourceField.tsx:L18-L21
  - symbol: VesselIdentityCombinedSourceField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/VesselIdentityCombinedSourceField.tsx:L22-L109
  - symbol: getIsCombinedSourceInTimerange
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/vessel-identity.utils.ts:L7-L20
  - symbol: getCombinedSourceSort
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/fields/vessel-identity.utils.ts:L22-L24
---

<!-- context:generated:start -->

## Summary

Renders vessel identity metadata (geartypes, shiptypes) with support for historical combined sources from multiple datasets. GFW users unlock expanded detail views. Time-range filtering ensures displayed sources overlap with vessel transmission period.

## Related

- uses [[guest-permission-guards]] — VesselIdentityCombinedSourceField gates extended detail views to GFW users via selectIsGFWUser
- uses [[redux-state-selectors-pattern]] — Depends on Redux selectors to fetch combined source info and user tier

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
