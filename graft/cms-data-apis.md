---
name: CMS Data APIs
slug: cms-data-apis
type: system
sources:
  - path: apps/platform/queries/map/data-terminology-api.ts
    hash: 8ea73749da752b04dd34b082257eb79bddecab7cda3c034943f52c9bb4a7b672
  - path: apps/platform/queries/map/user-guide-api.ts
    hash: 68d999a0ce103ee5a7477d2f0fba5a1561ab53444dcf838aabc64593cf01093b
sources_digest: f223da7e61c30751111dcb0908c8004c8beb16d63fde4ac377c5bf29240607a1
links:
  - to: gfw-base-query
    relation: depends_on
    description: Both rely on gfwBaseQuery for HTTP transport
  - to: query-api-infrastructure
    relation: uses
    description: Both APIs are injected into store via inject-api at runtime
generator:
  version: 1
covers:
  - symbol: DataTerminologyParams
    kind: type
    at: 'apps/platform/queries/map/data-terminology-api.ts:L8-L8'
  - symbol: UserGuideParams
    kind: type
    at: 'apps/platform/queries/map/user-guide-api.ts:L8-L8'
---

<!-- context:generated:start -->

## Summary

RTK Query services for fetching localized content from a Strapi CMS backend. Uses dynamic imports of loaders to prevent @strapi/client library from bloating entry chunks—a deliberate architectural constraint documented in store.ts. Supports data terminology definitions and user guide content indexed by locale.

## Related

- depends on [[gfw-base-query]] — Both rely on gfwBaseQuery for HTTP transport
- uses [[query-api-infrastructure]] — Both APIs are injected into store via inject-api at runtime

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
