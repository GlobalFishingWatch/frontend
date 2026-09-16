---
name: Insight Data Enrichment and Deduplication
slug: insight-data-enrichment-and-deduplication
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/vessel-group-insights/vessel-group-report-insights.selectors.ts
    hash: ccb56095f95e2bb5f4a9dc04bd6f98bc5781a525d44deb4ed4b0522cba1ce9f8
sources_digest: d9137234e36c687c4e6b389f4757755a8f0034a588649b84a5287352570b9a3c
links:
  - to: vessel-group-report-insights-system
    relation: implements
    description: >-
      Each insight component (VGRInsightGaps, VGRInsightFlagChange, etc.) uses
      specialized selectors to retrieve pre-processed vessel lists, enabling
      efficient rendering without per-component data transformation
generator:
  version: 1
covers:
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
---

<!-- context:generated:start -->

## Summary

Higher-order selector factory selectVGRVesselsByInsight retrieves vessels by insight type, deduplicates via getVesselsWithoutDuplicates (preserves first occurrence), enriches with resolved identity via getSearchIdentityResolved, and sorts by counter value or ship name. Early filtering removes zero-counter vessels to reduce noise. Supports convenience selectors for each type (gaps, IUU, flag changes) and specialized selectVGRMOUVesselsGrouped that restructures MOU data by country (Tokyo/Paris) and list status (black/grey).

## Related

- implements [[vessel-group-report-insights-system]] — Each insight component (VGRInsightGaps, VGRInsightFlagChange, etc.) uses specialized selectors to retrieve pre-processed vessel lists, enabling efficient rendering without per-component data transformation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
