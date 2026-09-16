---
name: Event Type Hierarchical CSV Schema
slug: event-type-hierarchical-csv-schema
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/events/events.report.download.ts
    hash: af6c3b0083c2b5b1e3e691ed1b66f4c75c611abe12c2b343e0e3f174805ea7a3
sources_digest: 1b4180be31fbfec651cb916066c34552fa74a97338333402e57c3b21d53a3baf
links:
  - to: events-report-system
    relation: implements
    description: >-
      CSV schema pattern ensures consistent column ordering and enables
      selective field export based on event type via accessor paths and
      transform functions like parseCSVDate
generator:
  version: 1
covers:
  - symbol: parseReportEventsToCSV
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/events/events.report.download.ts:L51-L60
---

<!-- context:generated:start -->

## Summary

Three-level CSV column hierarchy avoiding duplication: BASE_REPORT_EVENTS_CSV_CONFIG defines universal columns (type, timestamps, position, vessel IDs); ENCOUNTER and PORT_VISIT configs spread BASE and add event-type-specific fields (encountered vessel details, anchorage info). Event type inferred from first array element or passed explicitly.

## Related

- implements [[events-report-system]] — CSV schema pattern ensures consistent column ordering and enables selective field export based on event type via accessor paths and transform functions like parseCSVDate

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
