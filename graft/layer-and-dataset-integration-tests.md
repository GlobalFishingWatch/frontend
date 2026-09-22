---
name: Layer and Dataset Integration Tests
slug: layer-and-dataset-integration-tests
type: system
sources:
  - path: apps/platform/test/integration/App.spec.tsx
    hash: 4884573763c4a4ad0b1fa9ca106717b725b4360f4d90c565d9d491bc9d1aaede
  - path: apps/platform/test/integration/Datasets.spec.tsx
    hash: 19c70c06d16b0684be0df33fd78c0a5067ce9cebbb6396e2efb81c85dd29358b
sources_digest: ad758e729c746b26b92dd1fd4ff32f8ca8a830688e646704f855ca925facbdc0
links:
  - to: map-layer-and-viewport-state-management
    relation: validates
    description: Tests verify layer visibility and dataviewInstances persistence
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: 'Uses render(), makeStore(), and createTestingMiddleware'
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Validates layer visibility toggles, dataset additions (EEZ, bathymetry, events, vessels), and layer persistence in the Redux location query state. Tests exercise the Layer Library UI, dataviewInstances configuration, and layer loading through deck.gl with 1100ms+ debounce delays.

## Related

- validates [[map-layer-and-viewport-state-management]] — Tests verify layer visibility and dataviewInstances persistence
- depends on [[test-infrastructure-and-utilities]] — Uses render(), makeStore(), and createTestingMiddleware

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
