---
name: Print Mode
slug: print-mode
type: system
sources:
  - path: apps/platform/features/app/print.slice.ts
    hash: 663137d59e82b66e9454bb7465c80533079c2c1841c2069521f370529840a631
sources_digest: 6a01c932c123f11cc8fd9fb79bcada1a8604a3857fb0bad711384c9f514be617
links:
  - to: cms-content-management
    relation: uses
    description: >-
      DataTerminology component includes print-hidden class to suppress
      rendering in print contexts
generator:
  version: 1
covers:
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/app/print.slice.ts:L22-L22'
---

<!-- context:generated:start -->

## Summary

Redux slice managing application-wide print mode state via lazy-loaded feature module. Single action toggles print mode; selector drives CSS class application and component visibility (print-hidden class).

## Related

- uses [[cms-content-management]] — DataTerminology component includes print-hidden class to suppress rendering in print contexts

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
