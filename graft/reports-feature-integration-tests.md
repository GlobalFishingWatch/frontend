---
name: Reports Feature Integration Tests
slug: reports-feature-integration-tests
type: system
sources:
  - path: apps/platform/test/integration/Reports.spec.tsx
    hash: 9830e7a43f2f3201c71270a48d2c8d6751592f04a4ff80d1e4cf57d5b0fc24bd
sources_digest: daab95b1df4a6b7e9116c78adf63171b7d9e82eab067c44ddd4e1e195c76bcf8
links:
  - to: map-layer-and-viewport-state-management
    relation: depends_on
    description: >-
      Tests verify map state consistency across report navigation and time-range
      changes
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: >-
      Uses makeStore(), Jotai atoms (reportStateAtom, deckLayersStateAtom), and
      polling utilities
generator:
  version: 1
covers:
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

Validates area-based reports (EEZ/MPA), global reports with Activity/Events/Detections tabs, and data comparison mode. Tests poll Jotai's reportStateAtom for timeseries/stats, wait for lazily-injected queries, and verify tab switching and filter/timebar updates preserve map state consistency.

## Related

- depends on [[map-layer-and-viewport-state-management]] — Tests verify map state consistency across report navigation and time-range changes
- depends on [[test-infrastructure-and-utilities]] — Uses makeStore(), Jotai atoms (reportStateAtom, deckLayersStateAtom), and polling utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
