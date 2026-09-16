---
name: Report Visualization Components
slug: report-visualization-components
type: system
sources:
  - path: apps/platform/features/_reports/shared/vessels/ReportVessels.tsx
    hash: c49a8a5176b607186d9e9a400594fbf1c1d5603c5f56eab012a079ac88a5c8fc
  - path: apps/platform/features/_reports/shared/vessels/ReportVesselsFilter.tsx
    hash: 077d312e200ea79b509fd5b5f51dc006adc054fd83ff689917be7216b60c5f54
  - path: apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx
    hash: 5f666e394f1d2905ba175a1c23a5a9c0cc77ec74b6531288f15af90148812b56
  - path: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraphSelector.tsx
    hash: 2da59c2768e2f4ea5fa840ed93f0e14c0626c17ec0d4de4172ed17d29df186b7
  - path: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsIndividualTooltip.tsx
    hash: edede7e1f7d9a383f0308ce7f7ce4141e892eef51a23cf1ab65bb56e365c94b2
  - path: apps/platform/features/_reports/shared/vessels/ReportVesselsTable.tsx
    hash: 1ebc328fe94fd34c255d2e4618dae7ca5c7bf53b5ecc0547d0e6745fa79341eb
  - path: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx
    hash: e0dc2529e059fd0c34327e239121358b43b699700bec3551de7da40f30ae413b
  - path: apps/platform/features/_reports/shared/vessels/ReportVesselsTablePin.tsx
    hash: 763f37dc0e0b0939a12a14cef9158de791d7056f275d449af284265e43b5b8e0
  - path: apps/platform/features/_reports/shared/vessels/VesselGraphLink.tsx
    hash: 49e4c70ca395c424297e7f2ac3c301de8cf2c3879b40780bd35e898f8743995b
sources_digest: a764580cde765547a077614c155747c91a6e6bf560f49823de4d8eb0e7ea8f06
links:
  - to: filter-property-mapping-and-query-sync
    relation: uses
    description: >-
      ReportVesselsFilter, ReportVesselsGraph, and ReportGraphTick use
      FILTER_PROPERTIES to map UI interactions to query parameters and backend
      field names for multi-field searches
  - to: report-vessel-data-pipeline
    relation: depends_on
    description: >-
      Components consume normalized vessel tables, graph aggregations, and
      pagination metadata from report-vessels selectors
  - to: vessel-pinning-and-workspace-integration
    relation: uses
    description: >-
      ReportVesselsTablePin and ReportVessels trigger vessel pinning via
      usePinReportVessels, enforcing MAX_VESSEL_REPORT_PIN limits and
      coordinating with workspace dataview persistence
generator:
  version: 1
covers:
  - symbol: ReportVessels
    kind: function
    at: 'apps/platform/features/_reports/shared/vessels/ReportVessels.tsx:L26-L86'
  - symbol: ReportVesselsFilterProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsFilter.tsx:L15-L19
  - symbol: ReportVesselsFilter
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsFilter.tsx:L21-L80
  - symbol: ReportGraphTooltipProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L37-L50
  - symbol: ReportBarTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L60-L130
  - symbol: ReportGraphTick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L132-L201
  - symbol: getTickLabel
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L142-L159
  - symbol: onLabelClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L161-L170
  - symbol: ReportVesselsGraphProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L203-L211
  - symbol: ReportVesselsGraph
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L213-L265
  - symbol: onBarClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx:L223-L231
  - symbol: ReportVesselsGraphSelector
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraphSelector.tsx:L26-L126
  - symbol: onSelectSubsection
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsGraphSelector.tsx:L97-L111
  - symbol: ReportVesselsIndividualTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsIndividualTooltip.tsx:L11-L51
  - symbol: ReportVesselTableProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTable.tsx:L43-L47
  - symbol: ReportVesselsTable
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTable.tsx:L49-L309
  - symbol: onFilterClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTable.tsx:L78-L80
  - symbol: handleSortClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTable.tsx:L82-L90
  - symbol: onPinClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTable.tsx:L92-L98
  - symbol: ReportVesselsTableFooterProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L41-L43
  - symbol: ReportVesselsTableFooter
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L45-L237
  - symbol: onDownloadVesselsClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L76-L120
  - symbol: onPrevPageClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L122-L124
  - symbol: onNextPageClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L125-L127
  - symbol: onShowMoreClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L128-L137
  - symbol: onShowLessClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L138-L147
  - symbol: onAddToVesselGroup
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTableFooter.tsx:L149-L156
  - symbol: ReportVesselTablePinProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTablePin.tsx:L19-L22
  - symbol: ReportVesselsTablePinAll
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTablePin.tsx:L24-L97
  - symbol: handleOnClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/ReportVesselsTablePin.tsx:L42-L61
  - symbol: VesselGraphLink
    kind: function
    at: 'apps/platform/features/_reports/shared/vessels/VesselGraphLink.tsx:L7-L20'
---

<!-- context:generated:start -->

## Summary

A collection of React components rendering tabular and graphical vessel analysis, including sortable data tables, interactive bar charts, filter inputs, tooltips, and pagination controls. Enables users to inspect vessel metrics, drill down by categorical properties (flag, gear type, source), and perform bulk operations like pinning.

## Related

- uses [[filter-property-mapping-and-query-sync]] — ReportVesselsFilter, ReportVesselsGraph, and ReportGraphTick use FILTER_PROPERTIES to map UI interactions to query parameters and backend field names for multi-field searches
- depends on [[report-vessel-data-pipeline]] — Components consume normalized vessel tables, graph aggregations, and pagination metadata from report-vessels selectors
- uses [[vessel-pinning-and-workspace-integration]] — ReportVesselsTablePin and ReportVessels trigger vessel pinning via usePinReportVessels, enforcing MAX_VESSEL_REPORT_PIN limits and coordinating with workspace dataview persistence

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
