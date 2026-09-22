---
name: Chat API
slug: chat-api
type: file
sources:
  - path: apps/platform/queries/map/chat-api.ts
    hash: 0dcfe199604013f7271d02e6d015039d70198e2a5d3e5ed175af73f92c6bc9eb
sources_digest: 852a008dd3344dc2e52f383589e9958a01f01bc9df56e022747f8dd90e9c9685
links:
  - to: gfw-base-query
    relation: depends_on
    description: Uses gfwBaseQuery for authenticated HTTP request handling
  - to: query-api-infrastructure
    relation: uses
    description: Relies on inject-api to register itself in the Redux store
generator:
  version: 1
covers:
  - symbol: AgentThread
    kind: type
    at: 'apps/platform/queries/map/chat-api.ts:L14-L18'
---

<!-- context:generated:start -->

## Summary

RTK Query service for managing chat threads with a workspace navigator agent backend, providing thread CRUD operations with graceful 404 handling (empty arrays instead of errors for missing threads) and cache invalidation via tags. Exports AGENT_ID and AGENT_BASE_URL constants for reuse across the platform.

## Related

- depends on [[gfw-base-query]] — Uses gfwBaseQuery for authenticated HTTP request handling
- uses [[query-api-infrastructure]] — Relies on inject-api to register itself in the Redux store

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
