---
name: Vessel Group Report Insights System
slug: vessel-group-report-insights-system
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts
    hash: ccb56095f95e2bb5f4a9dc04bd6f98bc5781a525d44deb4ed4b0522cba1ce9f8
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.utils.ts
    hash: 9bff4feb9a4c3b4a7e5ad9ba68529138ba59325a88476523013f58910bd6ca2d
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverage.tsx
    hash: 55d31bfb70ee0063dbb0e6d98504cc42e078a00f37df15975c3f90317e50b737
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx
    hash: 301efef7894b2d65f8dde77881027ec3f5045493f768721c1cde249d2bbac9cb
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx
    hash: 823d3e9c9c32f6dd5426a7111b98849139f6c8f345b0a664beb57a75a1fa1ad9
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx
    hash: 66951e413a98a8a7ef06ab3a1ca44eb11ec7e5c8ecdf05fcb6f202fb9372f0e9
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx
    hash: 93b3d457c299ee4c02b64aca641c30c24fa5cdc6c70d81e1edf29b76df8b6572
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightIUU.tsx
    hash: e06e5e59bfe062c3f4b2608cf11f0aa253975cc57d8ed39a15e389bb90459954
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx
    hash: 448b6932910e79a3730f28cf48a1ce5470c2ed176e33e5485ad6f3eed7e5f971
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx
    hash: 4a9be44b103a1e16b45b3914c4c6d532bc0c8ddfe7704bf5e39d5e9f5bf1ca0b
  - path: apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsights.tsx
    hash: 23eb0a99e4e118ddbdbf5ea5d70adffcf29681e7d782e17fed5919685cdcdb92
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightsPlaceholders.tsx
    hash: 781ae09179f4c5484ad534a651ca747d33917a20cfb10243fc064b31ccaafbea
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightVesselEvents.tsx
    hash: 474144c2adaf390047e8b094ce7a2402f7630ed6e84a270503f81733abd1db68
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightVesselsTable.tsx
    hash: 8dbec0ab09242fce3f47cbb882467eed5d1ab54d8b302f9d24db088a7aa5c2ea
sources_digest: 98d213955ff8f18a29593dc35d65bedd46af6bf94907fb112a8702815de5df46
links:
  - to: analytics-tracking
    relation: uses
    description: >-
      All insight components track expansion and navigation actions via
      trackEvent with category TrackCategory.VesselGroupReport
  - to: authentication-and-access-control
    relation: depends_on
    description: >-
      VGRInsightFlagChange, VGRInsightMOU use selectIsGuestUser and
      VesselIdentityFieldLogin to restrict detailed views behind authentication;
      permission errors (403) render icon tooltips rather than generic messages
  - to: coverage-bucketing-schema
    relation: uses
    description: >-
      VGRInsightCoverageGraph uses COVERAGE_GRAPH_BUCKETS mapping and
      parseCoverageGraphValueBucket to classify coverage percentages into
      display bins for bar chart aggregation
  - to: insight-data-enrichment-and-deduplication
    relation: implements
    description: >-
      selectVGRVesselsByInsight higher-order selector retrieves vessels matching
      insight criteria, deduplicates via getVesselsWithoutDuplicates, enriches
      with resolved identity data, and sorts by counter values or ship name
  - to: redux-report-state
    relation: depends_on
    description: >-
      All insight components query selectVGRData,
      selectFetchVesselGroupReportXxxParams (insight-specific), and Redux
      selectors from vessel-group-report slice for vessel group context and
      filtered vessel lists
generator:
  version: 1
covers:
  - symbol: VesselGroupReportInsightCoverage
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverage.tsx:L18-L53
  - symbol: CustomTick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L18-L28
  - symbol: getDataByCoverage
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L30-L33
  - symbol: parseCoverageGraphAggregatedData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L35-L43
  - symbol: parseCoverageGraphIndividualData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L45-L55
  - symbol: VesselGroupReportInsightCoverageGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightCoverageGraph.tsx:L57-L93
  - symbol: VesselGroupReportInsightFishing
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L37-L226
  - symbol: onMPAToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L53-L67
  - symbol: onRFMOToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L69-L83
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L85-L91
  - symbol: getVesselGroupReportInsighFishingVessels
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFishing.tsx:L93-L155
  - symbol: VesselGroupReportInsightFlagChange
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:L28-L122
  - symbol: onInsightToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:L41-L52
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightFlagChange.tsx:L54-L60
  - symbol: VesselGroupReportInsightGap
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:L30-L155
  - symbol: onInsightToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:L41-L52
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightGaps.tsx:L54-L60
  - symbol: VesselGroupReportInsightIUU
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightIUU.tsx:L23-L81
  - symbol: onInsightToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightIUU.tsx:L34-L45
  - symbol: VesselWithEvents
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L32-L37
  - symbol: getVesselsWithEvents
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L39-L51
  - symbol: VesselGroupReportInsightLongline
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L53-L191
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L78-L87
  - symbol: onCategoryToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L89-L98
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L100-L106
  - symbol: renderCategoryVessels
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightLongline.tsx:L108-L153
  - symbol: ExpandedMOUInsights
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L34-L34
  - symbol: VesselGroupReportInsightMOU
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L36-L198
  - symbol: onVesselClick
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L47-L53
  - symbol: VesselsInMOUByCategory
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L64-L113
  - symbol: getVesselsInMOU
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L115-L156
  - symbol: onToggle
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightMOU.tsx:L116-L131
  - symbol: VesselGroupReportInsightVesselEvents
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightVesselEvents.tsx:L12-L63
  - symbol: VesselGroupReportInsightVesselTable
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightVesselsTable.tsx:L14-L61
  - symbol: VesselGroupReportInsights
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsights.tsx:L25-L76
  - symbol: VesselGroupReportInsightPlaceholder
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/VGRInsightsPlaceholders.tsx:L4-L6
  - symbol: VesselGroupReportInsightVessel
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts:L30-L32
  - symbol: selectVGRVesselsByInsight
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts:L34-L61
  - symbol: MouVesselByCategoryInsight
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts:L97-L100
  - symbol: MOUInsightCountry
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts:L102-L102
  - symbol: MOUInsightList
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts:L103-L103
  - symbol: MOUVesselByList
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts:L104-L104
  - symbol: MOUVesselsGrouped
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts:L105-L105
  - symbol: parseCoverageGraphValueBucket
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.utils.ts:L14-L22
---

<!-- context:generated:start -->

## Summary

Multi-faceted analytics dashboard surfacing vessel compliance and activity anomalies: fishing violations (RFMOs, no-take MPAs), flag changes, AIS tracking gaps, IUU blacklist status, longline fishing events, and MOU list classifications. Each insight type fetches via useGetVesselGroupInsightQuery, stores enriched vessel data in Redux (selectVGRGapVessels, selectVGRFlagChangesVessels, etc.), and renders collapsable sections with drill-down event details and CSV export where applicable.

## Related

- uses [[analytics-tracking]] — All insight components track expansion and navigation actions via trackEvent with category TrackCategory.VesselGroupReport
- depends on [[authentication-and-access-control]] — VGRInsightFlagChange, VGRInsightMOU use selectIsGuestUser and VesselIdentityFieldLogin to restrict detailed views behind authentication; permission errors (403) render icon tooltips rather than generic messages
- uses [[coverage-bucketing-schema]] — VGRInsightCoverageGraph uses COVERAGE_GRAPH_BUCKETS mapping and parseCoverageGraphValueBucket to classify coverage percentages into display bins for bar chart aggregation
- implements [[insight-data-enrichment-and-deduplication]] — selectVGRVesselsByInsight higher-order selector retrieves vessels matching insight criteria, deduplicates via getVesselsWithoutDuplicates, enriches with resolved identity data, and sorts by counter values or ship name
- depends on [[redux-report-state]] — All insight components query selectVGRData, selectFetchVesselGroupReportXxxParams (insight-specific), and Redux selectors from vessel-group-report slice for vessel group context and filtered vessel lists

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
