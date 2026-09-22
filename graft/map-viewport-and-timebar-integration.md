---
name: Map viewport and timebar integration
slug: map-viewport-and-timebar-integration
type: concept
sources:
  - path: apps/platform/features/_map/workspace/Workspace.tsx
    hash: 05602d715364a03a41cc315af05e65936f1b9aa7d49d0a8e7bafbce085f77569
  - path: apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx
    hash: 1e44835831d1c089c147ae90891d9d885b66c87349d1a50a6f75b03fee78b8ca
  - path: apps/platform/features/_reports/report-area/area-reports.hooks.tsx
    hash: 70313011499e2c852403577fad78104cc4a1551c8762ebc855e31edbdca6c80e
  - path: apps/platform/features/_reports/report-area/AreaReport.tsx
    hash: 88c8daa558c878a27400fc158e3f149f82103fee695ffd60ccdb56bd96ca6c0f
  - path: apps/platform/features/_reports/report-area/title/ReportTitle.tsx
    hash: a3fc63a2087f52aff548fcba2735b179c5a01b2f4e6560fc24877594f83955d9
sources_digest: 393ccfb760642887734b70c5981be7f65c89fb829da743180893a9616c4e7a56
links:
  - to: area-report-ui-components
    relation: implements
    description: >-
      Report components use viewport and timebar integration hooks for
      interactive map control
generator:
  version: 1
covers:
  - symbol: Workspace
    kind: function
    at: 'apps/platform/features/_map/workspace/Workspace.tsx:L44-L119'
  - symbol: getItemLabel
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L54-L59'
  - symbol: WorkspaceWizard
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L61-L274'
  - symbol: updateMatchingAreas
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L73-L85'
  - symbol: onInputChange
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L87-L96'
  - symbol: onSelectResult
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L98-L106'
  - symbol: onSearchClick
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L108-L115'
  - symbol: onHighlightedIndexChange
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L117-L123'
  - symbol: fetchMarineManagerData
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L126-L135'
  - symbol: onInputBlur
    kind: function
    at: 'apps/platform/features/_map/workspaces-list/WorkspaceWizard.tsx:L149-L154'
  - symbol: ReportTabContent
    kind: function
    at: 'apps/platform/features/_reports/report-area/AreaReport.tsx:L49-L63'
  - symbol: Report
    kind: function
    at: 'apps/platform/features/_reports/report-area/AreaReport.tsx:L65-L209'
  - symbol: handleTabClick
    kind: function
    at: 'apps/platform/features/_reports/report-area/AreaReport.tsx:L163-L176'
  - symbol: DateTimeSeries
    kind: type
    at: 'apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L83-L86'
  - symbol: isClose
    kind: function
    at: 'apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L92-L95'
  - symbol: useReportAreaCenter
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L97-L112
  - symbol: useStatsBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L114-L147
  - symbol: useVesselGroupActivityBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L149-L153
  - symbol: useVesselGroupBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L155-L159
  - symbol: usePortsReportAreaFootprint
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L161-L176
  - symbol: usePortsReportAreaFootprintBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L178-L187
  - symbol: useReportAreaBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L189-L245
  - symbol: isAreaCenterInViewport
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L247-L267
  - symbol: useReportAreaInViewport
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L269-L275
  - symbol: useFitAreaInViewport
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L277-L307
  - symbol: getSimplificationByDataview
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L315-L317
  - symbol: useFetchReportArea
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L319-L350
  - symbol: useFetchReportVessel
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L352-L427
  - symbol: usePortsReportAreaFootprintFitBounds
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L429-L439
  - symbol: useReportTitle
    kind: function
    at: >-
      apps/platform/features/_reports/report-area/area-reports.hooks.tsx:L441-L558
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

Cross-cutting pattern: map viewport is controlled via useSetMapCoordinates and useDeckMap, with async queuing when map loads after data. Report area bounds trigger viewport fitting via useFitAreaInViewport. Timebar visualization mode (historical vs. real-time) syncs with report category selection via useTimebarVisualisationConnect and useTimebarEnvironmentConnect hooks. Workspace changes reset timebar mode unless user has manually overridden it.

## Related

- implements [[area-report-ui-components]] — Report components use viewport and timebar integration hooks for interactive map control

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
