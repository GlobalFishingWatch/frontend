---
name: Server-Side Rendering Integration
slug: server-side-rendering-integration
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel.ssr.ts
    hash: 0456bd049a508ac944354fe9c2b65ee46e7282abb27e60d80620a4c1e2f2e60b
sources_digest: 016ec1e611cbaaf27a114ac9a0d8f5b35795c07ddff8b420433ab8447217f425
links:
  - to: identity-source-prioritization
    relation: implements
    description: >-
      Mirrors client-side identity prioritization in getUrlIdentity to ensure
      SSR metadata consistency
  - to: vessel-profile-core
    relation: implements
    description: >-
      Provides server-side data loading and metadata generation for vessel
      profile pages
generator:
  version: 1
covers:
  - symbol: VesselLoaderArgs
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.ssr.ts:L15-L19'
  - symbol: getUrlIdentity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.ssr.ts:L23-L41'
  - symbol: ssrLoadVessel
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.ssr.ts:L43-L75'
---

<!-- context:generated:start -->

## Summary

ssrLoadVessel loader fetches vessel data and resolves identity during server-side execution, returning HTML head metadata. Coordinates fetchDataviewsByIdsThunk for profile dataviews and fetchVesselInfoThunk for vessel details with optional related identities. Mirrors client-side identity selection logic via getUrlIdentity to prevent metadata mismatches when URL references unavailable sources. Gracefully degrades if store or vessel ID missing. Uses import.meta.env.SSR check to prevent duplicate async dispatches during client hydration.

## Related

- implements [[identity-source-prioritization]] — Mirrors client-side identity prioritization in getUrlIdentity to ensure SSR metadata consistency
- implements [[vessel-profile-core]] — Provides server-side data loading and metadata generation for vessel profile pages

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
