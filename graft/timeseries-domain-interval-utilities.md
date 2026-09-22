---
name: Timeseries Domain & Interval Utilities
slug: timeseries-domain-interval-utilities
type: file
sources:
  - path: libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts
    hash: 9beae984b9ebf3ac5db6c5e7ca292e728bcd07d98fc0a121cb7a41752a25f154
sources_digest: 107a12ce09cd87b48a99c916632655bd1cd07926f119aa2267b8101651f0c4d9
links:
  - to: chart-configuration-defaults
    relation: depends_on
    description: Relies on FourwingsInterval enum for temporal granularity
generator:
  version: 1
covers:
  - symbol: useTimeseriesDomain
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts:L9-L27
  - symbol: UseFullTimeseriesProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts:L29-L37
  - symbol: useFullTimeseries
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/timeseries.hooks.ts:L39-L87
---

<!-- context:generated:start -->

## Summary

Provides hooks for timeseries visualization: useTimeseriesDomain calculates inclusive date range bounds from start/end and FourwingsInterval; useFullTimeseries expands sparse data into complete interval-aligned arrays with sensible fallbacks (zeros for numeric, empty arrays for object values).

## Related

- depends on [[chart-configuration-defaults]] — Relies on FourwingsInterval enum for temporal granularity

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
