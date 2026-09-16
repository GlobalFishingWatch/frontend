# libs/responsive-visualizations/src/charts/timeseries/TimeseriesAggregated.tsx · [[responsive-bar-timeseries-chart-components]]

Module exporting a React component that renders an aggregated time-series chart using Recharts with responsive dimensions and customizable data visualization.

- tickFormatter · function · L14-L17 — Formats axis tick values using d3-format, switching between short-form and engineering notation based on magnitude.
- AggregatedTimeseriesProps · type · L19-L19 — Type alias for aggregated time-series visualization props extending the base TimeseriesByTypeProps interface.
- AggregatedTimeseries · function · L20-L111 — Renders a responsive, multi-line time-series chart with padded Y-axis domain, interpolated data points, and configurable tooltips and labels.
