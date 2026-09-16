---
name: Asynchronous Test Patterns
slug: asynchronous-test-patterns
type: concept
sources:
  - path: apps/platform/test/integration/App.spec.tsx
    hash: 4884573763c4a4ad0b1fa9ca106717b725b4360f4d90c565d9d491bc9d1aaede
  - path: apps/platform/test/integration/Datasets.spec.tsx
    hash: 19c70c06d16b0684be0df33fd78c0a5067ce9cebbb6396e2efb81c85dd29358b
  - path: apps/platform/test/integration/Map.spec.tsx
    hash: 60e079056717bc93b3d925e3a6eccf6030407370416786354280209177e40ca4
  - path: apps/platform/test/integration/Reports.spec.tsx
    hash: 9830e7a43f2f3201c71270a48d2c8d6751592f04a4ff80d1e4cf57d5b0fc24bd
  - path: apps/platform/test/integration/Timebar.spec.tsx
    hash: f5e0c9d1290d1155e6cd9563d3680aa645fd940a463b3dc471eadd3ef967a69d
  - path: apps/platform/test/integration/Vessels.spec.tsx
    hash: 22477e72ab30ec4668ffb57f4cf5049638ecab1491dd2a63d215353cdf0e21f9
  - path: apps/platform/test/setup/config.ts
    hash: 3e59d1071ed5b41982cd0529b50dc51a5f690bb3d60796a23ae0e1180c5d9e8e
sources_digest: d298a31aab5f8523a09cd9066ff1ffa9bf9dac1b1a6df24f303c934f55a89cdf
links:
  - to: test-infrastructure-and-utilities
    relation: part_of
    description: >-
      Global timing constants (MAP_INIT, LAYER_LOAD, DEBOUNCE) defined in
      test/setup/config.ts
generator:
  version: 1
covers:
  - symbol: getTileZoomLevels
    kind: function
    at: 'apps/platform/test/integration/Map.spec.tsx:L101-L109'
  - symbol: waitForLocationType
    kind: function
    at: 'apps/platform/test/integration/Reports.spec.tsx:L45-L47'
  - symbol: clickReportTab
    kind: function
    at: 'apps/platform/test/integration/Reports.spec.tsx:L49-L54'
  - symbol: waitForUserReportsReady
    kind: function
    at: 'apps/platform/test/integration/Reports.spec.tsx:L56-L60'
  - symbol: findUserReportByName
    kind: function
    at: 'apps/platform/test/integration/Reports.spec.tsx:L62-L64'
  - symbol: waitForReportFeaturesLoaded
    kind: function
    at: 'apps/platform/test/integration/Reports.spec.tsx:L66-L85'
  - symbol: getCalculatedReportHours
    kind: function
    at: 'apps/platform/test/integration/Reports.spec.tsx:L87-L101'
  - symbol: waitForStatsQueryLoaded
    kind: function
    at: 'apps/platform/test/integration/Reports.spec.tsx:L103-L127'
---

<!-- context:generated:start -->

## Summary

Test suite relies on polling assertions (expect.poll()) for state updates, explicit delays (setTimeout) for layer rendering and debounce operations, and timeouts (10-30s) for map initialization and async operations. Requests are coordinated through GFWAPITestUtils.waitForRequest() to ensure network calls complete before assertions. Notable gotcha: 1100ms+ debounce delays require explicit waits in timing-sensitive tests.

## Related

- part of [[test-infrastructure-and-utilities]] — Global timing constants (MAP_INIT, LAYER_LOAD, DEBOUNCE) defined in test/setup/config.ts

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
