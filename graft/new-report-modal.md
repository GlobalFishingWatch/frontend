---
name: New Report Modal
slug: new-report-modal
type: file
sources:
  - path: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx
    hash: efb24ddc916fb6659cbb98758abe102964e83eadaa8475a3df10007a8e1aca4a
sources_digest: c23f71925988642056456f97a3eaa7d86cbed64f800edf0692936853c22fea05
links:
  - to: report-crud-operations
    relation: uses
    description: >-
      Dispatches createReportThunk or updateReportThunk based on edit vs. create
      mode
  - to: report-state-configuration
    relation: uses
    description: >-
      Leverages time-range utilities and area string formatting from
      configuration module
  - to: workspace-routing-state
    relation: depends_on
    description: Reads workspace state and private datasets to control view access options
generator:
  version: 1
covers:
  - symbol: NewReportModalProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L37-L42
  - symbol: NewReportModal
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L44-L244
  - symbol: localizeReportString
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L58-L59
  - symbol: updateReport
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L82-L108
  - symbol: createReport
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L110-L149
  - symbol: onDaysFromLatestChange
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L151-L156
  - symbol: onSelectTimeRangeChange
    kind: function
    at: >-
      apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx:L158-L163
---

<!-- context:generated:start -->

## Summary

Modal dialog for creating and editing area-based reports, capturing metadata (name, description, time range, access level) and dispatching Redux thunks. Validates inputs, respects private dataset constraints on sharing, and handles locale-aware string preservation for curated reports.

## Related

- uses [[report-crud-operations]] — Dispatches createReportThunk or updateReportThunk based on edit vs. create mode
- uses [[report-state-configuration]] — Leverages time-range utilities and area string formatting from configuration module
- depends on [[workspace-routing-state]] — Reads workspace state and private datasets to control view access options

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
