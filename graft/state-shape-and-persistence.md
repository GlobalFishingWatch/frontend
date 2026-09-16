---
name: State Shape and Persistence
slug: state-shape-and-persistence
type: system
sources:
  - path: apps/platform/store/reducers.ts
    hash: 402624264de0ac78cb1d1d0a355833dc7af072e4ab704ddd2aee3d7d45aa2eee
  - path: apps/platform/store/store.dehydrated-state.ts
    hash: 767eb84b627720fee63f2e3d152a679b6ae5cab61f71009842af34afa8f197c6
sources_digest: 055727a025281939c6bcdbdac8ebac83cafcbd344a22f8052e6f4de399778a89
links:
  - to: redux-store-configuration
    relation: part_of
    description: Manages hydration and serialization of the root Redux state
generator:
  version: 1
covers:
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/store/reducers.ts:L33-L33'
  - symbol: RootState
    kind: type
    at: 'apps/platform/store/reducers.ts:L60-L60'
  - symbol: DehydratedReduxState
    kind: type
    at: 'apps/platform/store/store.dehydrated-state.ts:L11-L11'
  - symbol: DehydratedRouterData
    kind: type
    at: 'apps/platform/store/store.dehydrated-state.ts:L13-L13'
  - symbol: TanStackBootstrapWindow
    kind: type
    at: 'apps/platform/store/store.dehydrated-state.ts:L15-L18'
  - symbol: serializeReduxState
    kind: function
    at: 'apps/platform/store/store.dehydrated-state.ts:L20-L26'
  - symbol: getDehydratedReduxState
    kind: function
    at: 'apps/platform/store/store.dehydrated-state.ts:L28-L37'
---

<!-- context:generated:start -->

## Summary

Manages Redux state serialization for server-side rendering via serializeReduxState (vessel, dataviews, datasets slices) and rehydration via getDehydratedReduxState from TanStack Router's dehydration mechanism. Intentionally excludes location and user slices to allow client-side initialization.

## Related

- part of [[redux-store-configuration]] — Manages hydration and serialization of the root Redux state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
