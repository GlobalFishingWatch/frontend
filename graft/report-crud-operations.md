---
name: Report CRUD Operations
slug: report-crud-operations
type: system
sources:
  - path: apps/platform/features/_reports/reports.selectors.ts
    hash: d0e84334b3d56d9959e7915bee4744ffacf8a21360f788148a7f0b5e08ddd19d
  - path: apps/platform/features/_reports/reports.slice.ts
    hash: 9946c92b3dfc01fd83fe0e97c33e8a3e56a4c19012ade044cd419f35ebfcec93
sources_digest: d604a799efb762af82b3c87170520fbb6aa53e2136eb032f101cdde7a64c3e75
links:
  - to: report-state-configuration
    relation: depends_on
    description: >-
      Relies on ReportState type definitions for shape validation and
      DEFAULT_PAGINATION_PARAMS
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Reads active workspace and user context for filtering reports and
      enforcing access control
generator:
  version: 1
covers:
  - symbol: ReportState
    kind: type
    at: 'apps/platform/features/_reports/reports.slice.ts:L144-L144'
  - symbol: ReportsSliceState
    kind: type
    at: 'apps/platform/features/_reports/reports.slice.ts:L145-L145'
  - symbol: selectAllReports
    kind: function
    at: 'apps/platform/features/_reports/reports.slice.ts:L163-L165'
  - symbol: selectReportsStatus
    kind: function
    at: 'apps/platform/features/_reports/reports.slice.ts:L171-L171'
  - symbol: selectReportsStatusId
    kind: function
    at: 'apps/platform/features/_reports/reports.slice.ts:L172-L172'
---

<!-- context:generated:start -->

## Summary

Redux Toolkit slice managing report fetch, create, update, and delete operations via GFWAPI. Implements conditional thunk execution, pagination, error parsing, and immutable field stripping on updates. Supports area, port, and vessel group report types.

## Related

- depends on [[report-state-configuration]] — Relies on ReportState type definitions for shape validation and DEFAULT_PAGINATION_PARAMS
- depends on [[workspace-routing-state]] — Reads active workspace and user context for filtering reports and enforcing access control

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
