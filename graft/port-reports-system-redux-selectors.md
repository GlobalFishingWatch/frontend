---
name: Port reports system (Redux & selectors)
slug: port-reports-system-redux-selectors
type: system
sources:
  - path: apps/platform/features/_reports/report-port/ports-report.config.ts
    hash: 9b8162b185014a69897551bcd2f11fc2cf026c585e48a0220495152dd7d8c488
  - path: apps/platform/features/_reports/report-port/ports-report.selectors.ts
    hash: 124f00d25494f8d0cc6a943405d68d5173025e7a3367732588a07f58809a32bb
sources_digest: f3122cf95b6c0e9f1e2fe5ebf8c7cde971542d0845a55ea42a018984989450d1
links:
  - to: dataview-and-dataset-loading-integration
    relation: depends_on
    description: Searches resolved dataview instances for port-related layers
  - to: port-report-ui-components
    relation: implements
    description: >-
      Provides port footprint data and dataset IDs consumed by port report
      components
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Redux selectors retrieving port-specific report footprint data, including dataset identification and area detail lookup. Selectors search resolved dataview instances for AIS/VMS ports footprint dataviews, extract ContextTiles dataset IDs, and resolve area geometry by port ID. Coordinates with areas.slice for geographic footprint data.

## Related

- depends on [[dataview-and-dataset-loading-integration]] — Searches resolved dataview instances for port-related layers
- implements [[port-report-ui-components]] — Provides port footprint data and dataset IDs consumed by port report components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
