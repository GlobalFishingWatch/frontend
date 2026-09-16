---
name: Data Query & API Integration
slug: data-query-api-integration
type: system
sources:
  - path: apps/platform/queries/base.ts
    hash: 460f215b7c81bdb1280d71fd9b0b7bb4307e34ec77ed9ae9c0cdc16128880c70
sources_digest: 6f859f711777c792c1b9747d1de97e7db4880a2979b06bd923cdad7e20375289
links:
  - to: ocean-areas-api-hook
    relation: uses
    description: >-
      useOceanAreas hook uses this query infrastructure to call ocean-areas
      backend endpoints
generator:
  version: 1
covers:
  - symbol: getQueryParamsResolved
    kind: function
    at: 'apps/platform/queries/base.ts:L7-L9'
  - symbol: gfwBaseQuery
    kind: function
    at: 'apps/platform/queries/base.ts:L11-L39'
---

<!-- context:generated:start -->

## Summary

RTK Query foundation for type-safe API calls via gfwBaseQuery factory, which wraps GFWAPI.fetch and standardizes error handling through parseAPIError. Provides query parameter resolution via getQueryParamsResolved (qs library with array index formatting) and supports generic Response types for different endpoints.

## Related

- uses [[ocean-areas-api-hook]] — useOceanAreas hook uses this query infrastructure to call ocean-areas backend endpoints

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
