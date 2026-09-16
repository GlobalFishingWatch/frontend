---
name: Redux Selector Memoization
slug: redux-selector-memoization
type: system
sources:
  - path: apps/platform/utils/selectors.ts
    hash: eff89dba248f5a491f2165d56879505ca8d5b8bb5a2d46da59b74320db7fe5e7
sources_digest: 94bacb1b87dc2be00a4905195f95cc8d9be46cb077cf0ddc4485e35d6dc6df55
links:
  - to: redux-store
    relation: uses
    description: >-
      Provides improved selector creation for Redux state derivations across the
      platform
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Specialized selector factory (createDeepEqualSelector) that uses deep equality comparison instead of reference equality when memoizing Redux selectors, preventing spurious recalculations when input objects have identical values but different references. Wraps reselect with es-toolkit's isEqual and lruMemoize.

## Related

- uses [[redux-store]] — Provides improved selector creation for Redux state derivations across the platform

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
