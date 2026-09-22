---
name: Charts Public API
slug: charts-public-api
type: file
sources:
  - path: libs/timebar/src/charts/index.ts
    hash: a18fc5dfbb7fedf2014ed2732103c2c4968fcd165c244313ffef408aba2f0d4d
sources_digest: 5a5d7f5a8f29ad6b03f4c6ac81933d3c1d1f6d3585e8f0fac218c7b318a253da
links:
  - to: chart-rendering-engine
    relation: implements
    description: >-
      useOuterScale hook is consumed by chart components to retrieve
      TimelineScale scaling functions for geometry positioning
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Barrel export centralizing public APIs for the charts submodule. Re-exports useOuterScale hook and all type definitions from charts.types, decoupling consumers from internal hook/type file organization.

## Related

- implements [[chart-rendering-engine]] — useOuterScale hook is consumed by chart components to retrieve TimelineScale scaling functions for geometry positioning

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
