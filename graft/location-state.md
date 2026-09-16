---
name: Location State
slug: location-state
type: file
sources:
  - path: apps/platform/router/location.slice.ts
    hash: c05a949ccfd24e7ea9f836f9e98279a4bfb8c227febc1b12587dad31c61430ac
sources_digest: 3c81a6d228b30dfaafafe9e3795b98c3372f5cb4d710d7b47b3320feaadd8fed
links:
  - to: route-configuration
    relation: depends_on
    description: Imports route types and utility types from routes module
  - to: route-synchronization
    relation: uses
    description: router-sync dispatches setLocation action to update this state
generator:
  version: 1
covers:
  - symbol: LocationPayload
    kind: type
    at: 'apps/platform/router/location.slice.ts:L10-L10'
  - symbol: LocationState
    kind: interface
    at: 'apps/platform/router/location.slice.ts:L24-L37'
---

<!-- context:generated:start -->

## Summary

Redux slice managing application location during migration from legacy routing to TanStack Router. Maintains both legacy fields (type, payload, query, pathname) and new TanStack Router fields (to) in LocationState, with prev object for history tracking. Initial state defaults to MAP route. Key constraint: undefined union on LocationPayload values accommodates optional route parameters across both old/new routing paradigms.

## Related

- depends on [[route-configuration]] — Imports route types and utility types from routes module
- uses [[route-synchronization]] — router-sync dispatches setLocation action to update this state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
