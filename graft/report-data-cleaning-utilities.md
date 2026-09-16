---
name: Report data cleaning utilities
slug: report-data-cleaning-utilities
type: file
sources:
  - path: apps/platform/features/_reports/report-dataview-cleaners.ts
    hash: 3a866f62bc62e0c08e8ab9dd3bd384860d1a24c6295ef560330fa7565f519960
sources_digest: 8757c541673285509b9dfb4b55f61a6e1c0fe2ff0f014615cf95ef1320dc7381
links:
  - to: workspace-utilities-and-validation
    relation: implements
    description: >-
      Provides cleaners consumed by workspace.utils.cleanReportPayload for
      report-aware workspace saving
generator:
  version: 1
covers:
  - symbol: cleanAggregateByPropertyDataviewFromReport
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-cleaners.ts:L14-L26'
  - symbol: cleanDatasetComparisonDataviewInstances
    kind: function
    at: 'apps/platform/features/_reports/report-dataview-cleaners.ts:L28-L34'
---

<!-- context:generated:start -->

## Summary

Utility module sanitizing dataview configurations before workspace persistence by removing report-specific metadata. Exports cleanAggregateByPropertyDataviewFromReport (removes aggregateByProperty field) and cleanDatasetComparisonDataviewInstances (filters temporary comparison dataviews by DATASET_COMPARISON_SUFFIX). Deliberately isolated to prevent heavy report dependencies (turf, match-sorter, simple-statistics, deck-layers) from being bundled into the main entry chunk.

## Related

- implements [[workspace-utilities-and-validation]] — Provides cleaners consumed by workspace.utils.cleanReportPayload for report-aware workspace saving

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
