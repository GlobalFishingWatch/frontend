---
name: Filter Property Mapping and Query Sync
slug: filter-property-mapping-and-query-sync
type: concept
sources:
  - path: apps/platform/features/_reports/shared/vessels/report-vessels.config.ts
    hash: c270287bc41f7e89e2f1f309cda85a97f0dedadc27b5546331b742683794beb8
  - path: apps/platform/features/_reports/shared/vessels/ReportVesselsFilter.tsx
    hash: 077d312e200ea79b509fd5b5f51dc006adc054fd83ff689917be7216b60c5f54
  - path: apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx
    hash: 5f666e394f1d2905ba175a1c23a5a9c0cc77ec74b6531288f15af90148812b56
sources_digest: 5a4fc629f61315c732e15dce11dabafe12db836d0ccf12a7b1fce984ca95c13a
links:
  - to: report-visualization-components
    relation: implements
    description: >-
      ReportVesselsFilter uses debounced query sync and ReportVesselsGraph uses
      FILTER_PROPERTIES mapping to convert click events to search parameters
generator:
  version: 1
covers:
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
  - symbol: FilterProperty
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.config.ts:L1-L1
  - symbol: ReportFilterProperty
    kind: type
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.config.ts:L10-L10
---

<!-- context:generated:start -->

## Summary

A design pattern that decouples vessel filtering UI from backend data structures by mapping user-facing filter categories (name, flag, mmsi, type, gear, source) to one or more backend field names, enabling multi-field searches and future field additions without UI changes. Query parameters are synchronized via debounced URL updates through useReplaceQueryParams.

## Related

- implements [[report-visualization-components]] — ReportVesselsFilter uses debounced query sync and ReportVesselsGraph uses FILTER_PROPERTIES mapping to convert click events to search parameters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
