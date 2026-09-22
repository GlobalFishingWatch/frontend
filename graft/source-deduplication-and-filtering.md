---
name: Source Deduplication and Filtering
slug: source-deduplication-and-filtering
type: concept
sources:
  - path: apps/platform/features/_reports/shared/summary/report-summary.utils.ts
    hash: 39dc5ca0719b0eab4a9c5a88da20681354f828de6340e45ab0f285940fea907f
sources_digest: 780f5f973e3611bec145ebd236012542520a7646bba1c3896440d778d2a2c5f4
links:
  - to: report-summary
    relation: implements
    description: >-
      Used internally by summary components to prepare source labels and filters
      for dataview tag display
generator:
  version: 1
covers:
  - symbol: DataviewSource
    kind: type
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.utils.ts:L3-L3
  - symbol: getReportSourcesWithVessels
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/report-summary.utils.ts:L5-L12
---

<!-- context:generated:start -->

## Summary

A utility (getReportSourcesWithVessels) that deduplicates data sources by ID and optionally filters to include only sources with associated vessel data. Enables flexible report filtering where callers can restrict results to vessel-containing sources or include all sources, supporting different report context requirements.

## Related

- implements [[report-summary]] — Used internally by summary components to prepare source labels and filters for dataview tag display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
