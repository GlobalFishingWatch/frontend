---
name: Responsive Bar & Timeseries Chart Components
slug: responsive-bar-timeseries-chart-components
type: system
sources:
  - path: libs/responsive-visualizations/src/charts/timeseries/Timeseries.tsx
    hash: cf3b3673f68982d49ce7c4147dedde666909c832eb329164e62d5bfa0578bca7
  - path: >-
      libs/responsive-visualizations/src/charts/timeseries/TimeseriesAggregated.tsx
    hash: 4ec41bfc3aa67e02c1f6782f9df37e64395decd18f9b03454a9fe7c6a14211b9
  - path: >-
      libs/responsive-visualizations/src/charts/timeseries/TimeseriesIndividual.tsx
    hash: 30d7bd52ca7d1d23ed71ad77b7710eba104fe859cb043eda31c197a1289f8d18
sources_digest: ea881b37edea31a10c982ffb79950b1377fc28b11d38113801426d10ba593e29
links:
  - to: chart-configuration-defaults
    relation: depends_on
    description: >-
      Reads DEFAULT_DATE_KEY, DEFAULT_AGGREGATED_ITEM_KEY, AXIS_LABEL_PADDING,
      DEFAULT_POINT_SIZE
  - to: color-accessibility
    relation: uses
    description: >-
      AggregatedTimeseries calls getContrastSafeColor for accessible color
      selection on lines
  - to: individual-point-rendering
    relation: uses
    description: >-
      IndividualTimeseries renders each discretized point via IndividualPoint
      with hover tooltip management
  - to: responsive-chart-hooks-orchestration
    relation: uses
    description: >-
      Uses useResponsiveVisualization and useValueKeys to compute layout and
      normalize keys
  - to: timeseries-domain-interval-utilities
    relation: uses
    description: >-
      AggregatedTimeseries and IndividualTimeseries both call
      useTimeseriesDomain and useFullTimeseries to build complete
      interval-aligned datasets
generator:
  version: 1
covers:
  - symbol: ResponsiveTimeseriesProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/Timeseries.tsx:L19-L22
  - symbol: ResponsiveTimeseries
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/Timeseries.tsx:L24-L95
  - symbol: tickFormatter
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/TimeseriesAggregated.tsx:L14-L17
  - symbol: AggregatedTimeseriesProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/TimeseriesAggregated.tsx:L19-L19
  - symbol: AggregatedTimeseries
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/TimeseriesAggregated.tsx:L20-L111
  - symbol: IndividualTimeseriesProps
    kind: type
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/TimeseriesIndividual.tsx:L16-L19
  - symbol: IndividualTimeseries
    kind: function
    at: >-
      libs/responsive-visualizations/src/charts/timeseries/TimeseriesIndividual.tsx:L21-L88
---

<!-- context:generated:start -->

## Summary

Renders responsive multi-line timeseries (aggregated & individual modes) and responsive bar charts, dispatching to specialized sub-components based on density analysis. ResponsiveTimeseries delegates to IndividualTimeseries or AggregatedTimeseries; both timeseries variants use d3 scales and Recharts for rendering. IndividualTimeseries renders point-based layouts via IndividualPoint components; AggregatedTimeseries renders continuous lines with padded Y-axis domains.

## Related

- depends on [[chart-configuration-defaults]] — Reads DEFAULT_DATE_KEY, DEFAULT_AGGREGATED_ITEM_KEY, AXIS_LABEL_PADDING, DEFAULT_POINT_SIZE
- uses [[color-accessibility]] — AggregatedTimeseries calls getContrastSafeColor for accessible color selection on lines
- uses [[individual-point-rendering]] — IndividualTimeseries renders each discretized point via IndividualPoint with hover tooltip management
- uses [[responsive-chart-hooks-orchestration]] — Uses useResponsiveVisualization and useValueKeys to compute layout and normalize keys
- uses [[timeseries-domain-interval-utilities]] — AggregatedTimeseries and IndividualTimeseries both call useTimeseriesDomain and useFullTimeseries to build complete interval-aligned datasets

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
