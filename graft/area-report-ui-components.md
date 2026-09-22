---
name: Area report UI components
slug: area-report-ui-components
type: system
sources:
  - path: apps/platform/features/_reports/report-area/AreaReport.tsx
    hash: 88c8daa558c878a27400fc158e3f149f82103fee695ffd60ccdb56bd96ca6c0f
  - path: apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx
    hash: 842271ab176b14d640df65cde753e0b7dc808ba3d486ed73c47aba1de8ca16c7
  - path: apps/platform/features/_reports/report-area/title/ReportTitle.tsx
    hash: a3fc63a2087f52aff548fcba2735b179c5a01b2f4e6560fc24877594f83955d9
sources_digest: 23c23d38921c6c7a527bc3b401a7cf8b14dd5ffed621d5423baec864f361fdf9
links:
  - to: area-reports-system-core-logic-selectors
    relation: uses
    description: >-
      Consumes area report selectors and hooks for viewport fitting, title
      generation, and vessel filtering
  - to: map-viewport-and-timebar-integration
    relation: uses
    description: >-
      Uses useSetMapCoordinates, useDeckMap, and timebar connection hooks for
      visualization synchronization
  - to: report-activity-and-vessel-data
    relation: depends_on
    description: >-
      Renders activity, detection, and event report components conditionally
      based on available dataviews
generator:
  version: 1
covers:
  - symbol: ReportTabContent
    kind: function
    at: 'apps/platform/features/_reports/report-area/AreaReport.tsx:L49-L63'
  - symbol: Report
    kind: function
    at: 'apps/platform/features/_reports/report-area/AreaReport.tsx:L65-L209'
  - symbol: handleTabClick
    kind: function
    at: 'apps/platform/features/_reports/report-area/AreaReport.tsx:L163-L176'
  - symbol: BufferButonTooltipProps
    kind: type
    at: >-
      apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx:L27-L37
  - symbol: BufferButtonTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx:L43-L186
  - symbol: handleInputChange
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/title/BufferButonTooltip.tsx:L77-L83
  - symbol: ReportTitle
    kind: function
    at: 'apps/platform/features/_reports/report-area/title/ReportTitle.tsx:L55-L326'
  - symbol: onAfterPrint
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/title/ReportTitle.tsx:L118-L118
  - symbol: onPrintClick
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/title/ReportTitle.tsx:L123-L132
---

<!-- context:generated:start -->

## Summary

React components rendering area-based reports—AreaReport is the main container managing tab navigation (Activity, Detections, Events, Environment, Others), data loading states, and timebar synchronization; ReportTitle displays report metadata and controls for buffer operations and printing; BufferButtonTooltip provides interactive buffer configuration with unit/operation selection and preview. Components coordinate viewport fitting, error handling, and analytics tracking.

## Related

- uses [[area-reports-system-core-logic-selectors]] — Consumes area report selectors and hooks for viewport fitting, title generation, and vessel filtering
- uses [[map-viewport-and-timebar-integration]] — Uses useSetMapCoordinates, useDeckMap, and timebar connection hooks for visualization synchronization
- depends on [[report-activity-and-vessel-data]] — Renders activity, detection, and event report components conditionally based on available dataviews

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
