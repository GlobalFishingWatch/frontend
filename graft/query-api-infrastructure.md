---
name: Query API Infrastructure
slug: query-api-infrastructure
type: system
sources:
  - path: apps/platform/queries/inject-api.ts
    hash: b20d609f34118fc1b49bf867919e2440412a6ecdcfb80afcf12d12b2dbc798c4
  - path: apps/platform/queries/lazy-apis.types.ts
    hash: 56a22570bd96d9b2fe8a21965d76adf81d61600599eb3e0b485c7ad996376898
sources_digest: 15fdc297bae1c274c5e422bc0e5f0993ea8a23c9a9d0a0e171a87e280f5070e4
links:
  - to: chat-api
    relation: produces
    description: >-
      inject-api enables runtime registration of chat API into store middleware
      and reducers
  - to: cms-data-apis
    relation: produces
    description: >-
      inject-api enables runtime registration of terminology and guide APIs into
      store
  - to: statistics-apis
    relation: produces
    description: >-
      inject-api enables runtime registration of dataview stats and event stats
      APIs
  - to: vessel-and-search-apis
    relation: produces
    description: >-
      inject-api enables runtime registration of vessel events, insight, and
      search APIs
generator:
  version: 1
covers:
  - symbol: QueryReducerPath
    kind: type
    at: 'apps/platform/queries/inject-api.ts:L17-L17'
  - symbol: InjectableApi
    kind: type
    at: 'apps/platform/queries/inject-api.ts:L21-L25'
  - symbol: injectQueryApi
    kind: function
    at: 'apps/platform/queries/inject-api.ts:L30-L36'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/queries/lazy-apis.types.ts:L13-L22'
---

<!-- context:generated:start -->

## Summary

RTK Query service layer providing centralized data fetching for the platform's Redux store, with dynamic middleware registration, lazy loading support, and type-safe API definition patterns. Enables conditional loading of query APIs at runtime rather than at bundle initialization, reducing initial load overhead and supporting code splitting.

## Related

- produces [[chat-api]] — inject-api enables runtime registration of chat API into store middleware and reducers
- produces [[cms-data-apis]] — inject-api enables runtime registration of terminology and guide APIs into store
- produces [[statistics-apis]] — inject-api enables runtime registration of dataview stats and event stats APIs
- produces [[vessel-and-search-apis]] — inject-api enables runtime registration of vessel events, insight, and search APIs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
