---
name: Axis and Domain Configuration
slug: axis-and-domain-configuration
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx
    hash: da75ac418bc124a1dc54c1d279693673b51f7595357d1630cab1fde3ed45545a
  - path: apps/platform/features/_reports/tabs/activity/ReportActivityEvolution.tsx
    hash: 13cc30b962333e95e28b92cdb2d48f9f0c6126935e1d27aacfe815301834ce4f
sources_digest: f67c498cb9e24aa4e3d7175cf13e2a6944a2d18ccf788a28c7a05ea867640af4
links:
  - to: activity-graph-rendering
    relation: implements
    description: >-
      Graph components implement axis padding, domain calculation, and dual-axis
      configuration
generator:
  version: 1
covers:
  - symbol: ReportActivityDatasetComparisonProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L28-L32
  - symbol: filterDataBySublayer
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L34-L65
  - symbol: findDataviewData
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L67-L71
  - symbol: calculateXDomain
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L73-L83
  - symbol: calculateYAxisDomain
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L85-L100
  - symbol: ReportActivityDatasetComparisonGraph
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityDatasetComparisonGraph.tsx:L102-L283
  - symbol: EvolutionTooltipContentProps
    kind: type
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityEvolution.tsx:L34-L39
  - symbol: ReportActivityEvolution
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/ReportActivityEvolution.tsx:L41-L294
---

<!-- context:generated:start -->

## Summary

Recharts graphs auto-scale Y-axes based on actual data ranges with 10% padding (or 10% of dataMax if range is zero) to prevent data from touching edges. X-domain calculations handle mismatched time intervals between datasets. Two-axis approach pairs primary dataset on left Y-axis with comparison dataset on right Y-axis using contrast-safe colors. Dynamic interval adjustment (via getFourwingsInterval) selects appropriate aggregation when fourwings data interval is finer than MONTH.

## Related

- implements [[activity-graph-rendering]] — Graph components implement axis padding, domain calculation, and dual-axis configuration

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
