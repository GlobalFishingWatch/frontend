---
name: Port report UI components
slug: port-report-ui-components
type: system
sources:
  - path: apps/platform/features/_reports/report-port/PortReportHeader.tsx
    hash: 33c016060b4d3de74eb23c3d1ca1f84c5fe0db0e42fcbfbd05835741e0613d00
  - path: apps/platform/features/_reports/report-port/ports-report.utils.ts
    hash: e1cd9b5bce70fc92a14d4df905875bb61aa512c4c999a2438e15f51002ab671b
  - path: apps/platform/features/_reports/report-port/PortsReport.tsx
    hash: c76e0b1e860af779d2d7b4502c51a43633c9ce591f9540e16f8348ac29ffaa41
sources_digest: b79b3dad3e73a8d823b1d30a678b148a291751e9719565dd68fd01aaa9801ee7
links:
  - to: area-report-ui-components
    relation: depends_on
    description: >-
      PortsReport reuses EventsReport component for generic events report
      rendering
  - to: port-reports-system-redux-selectors
    relation: uses
    description: >-
      Consumes port footprint selectors and configuration for area fitting and
      dataset references
generator:
  version: 1
covers:
  - symbol: PortReportHeader
    kind: function
    at: 'apps/platform/features/_reports/report-port/PortReportHeader.tsx:L13-L27'
  - symbol: PortsReport
    kind: function
    at: 'apps/platform/features/_reports/report-port/PortsReport.tsx:L6-L11'
  - symbol: isPortClusterDataviewForReport
    kind: function
    at: 'apps/platform/features/_reports/report-port/ports-report.utils.ts:L6-L8'
  - symbol: getPortClusterDataviewForReport
    kind: function
    at: 'apps/platform/features/_reports/report-port/ports-report.utils.ts:L10-L37'
  - symbol: cleanPortClusterDataviewFromReport
    kind: function
    at: 'apps/platform/features/_reports/report-port/ports-report.utils.ts:L39-L48'
---

<!-- context:generated:start -->

## Summary

React components rendering port-specific reports—PortsReport wraps EventsReport while orchestrating workspace migration notifications and map viewport fitting based on area footprints; PortReportHeader displays port metadata (name, country) from Redux state. Components delegate to generic events report display logic.

## Related

- depends on [[area-report-ui-components]] — PortsReport reuses EventsReport component for generic events report rendering
- uses [[port-reports-system-redux-selectors]] — Consumes port footprint selectors and configuration for area fitting and dataset references

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
