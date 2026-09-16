---
name: Time-Range Validation in Insights
slug: time-range-validation-in-insights
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/insights/insights.config.ts
    hash: 5754c3abf6a675ffc8fe52f43dff8d1d4702f53aa58f3806163738b8ff217147
  - path: apps/platform/features/_vessels/vessel/insights/Insights.tsx
    hash: c73a3e3cb0f88250f82f6b179e46af1f10b39255fe704fcabbf170618485dcce
sources_digest: 66708d9281302dd2dffa6d3e5eb1f2f32446699711f40bc641bc825e09d44d37
links:
  - to: vessel-insights-display-system
    relation: part_of
    description: >-
      Time-range validation gates all insight rendering and displays appropriate
      disclaimer messages
generator:
  version: 1
covers:
  - symbol: Insights
    kind: function
    at: 'apps/platform/features/_vessels/vessel/insights/Insights.tsx:L22-L65'
  - symbol: NonAPIInsights
    kind: type
    at: 'apps/platform/features/_vessels/vessel/insights/insights.config.ts:L6-L6'
  - symbol: VesselInsight
    kind: type
    at: 'apps/platform/features/_vessels/vessel/insights/insights.config.ts:L8-L8'
---

<!-- context:generated:start -->

## Summary

Pattern validating that selected time ranges are within available data bounds (MIN_INSIGHTS_YEAR = 2020 onwards). Insights component blocks rendering entirely and displays disclaimer if query start date is before 2020, preventing empty or invalid insight displays. Constraint: must validate before rendering any insight content to avoid confusing users with missing data.

## Related

- part of [[vessel-insights-display-system]] — Time-range validation gates all insight rendering and displays appropriate disclaimer messages

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
