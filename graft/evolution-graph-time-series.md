---
name: Evolution Graph Time Series
slug: evolution-graph-time-series
type: system
sources:
  - path: apps/platform/features/_reports/tabs/activity/BeforeAfterGraphTooltip.tsx
    hash: dd93fa46d20defc9ac02e2939f7fd8cb46abeda9b3a517ed1796fbb91ad1e115
  - path: apps/platform/features/_reports/tabs/activity/DataComparisonLegend.tsx
    hash: b8311e7ec27a299f47b48a3255cea9399553e98b7b7da0cd0184cc2371f68efd
  - path: apps/platform/features/_reports/tabs/activity/EvolutionGraphTooltip.tsx
    hash: 8060fc7304d8996450f9cd2da56efb24a1715e8c9ec2fb443104bd437f8a382f
  - path: >-
      apps/platform/features/_reports/tabs/activity/PeriodComparisonGraphTooltip.tsx
    hash: 6748a10ee46276d3ca2a75952231b4b14bcfe5eb16b5336001e5d348c539b068
sources_digest: 2db1c21efdf440c40f1fba109a11fb3494bb0e820592db6e828c006d652087c8
links:
  - to: activity-report-visualization
    relation: implements
    description: >-
      Tooltip and legend components render chart hover details and legends for
      evolution, before/after, and period comparison graphs
generator:
  version: 1
covers:
  - symbol: formatTooltipValue
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/BeforeAfterGraphTooltip.tsx:L9-L22
  - symbol: BeforeAfterGraphTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/BeforeAfterGraphTooltip.tsx:L24-L47
  - symbol: DataComparisonLegend
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/DataComparisonLegend.tsx:L5-L23
  - symbol: formatEvolutionTooltipValue
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/EvolutionGraphTooltip.tsx:L8-L23
  - symbol: EvolutionGraphTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/EvolutionGraphTooltip.tsx:L25-L54
  - symbol: PeriodComparisonGraphTooltip
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/PeriodComparisonGraphTooltip.tsx:L15-L50
---

<!-- context:generated:start -->

## Summary

Manages time-series data transformation and visualization for activity evolution graphs, including tooltip formatting, uncertainty calculations, and period-comparison logic. Produces structured chart data with min/max ranges and average values for rendering in Recharts components.

## Related

- implements [[activity-report-visualization]] — Tooltip and legend components render chart hover details and legends for evolution, before/after, and period comparison graphs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
