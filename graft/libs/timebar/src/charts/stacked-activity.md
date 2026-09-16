# libs/timebar/src/charts/stacked-activity.tsx · [[chart-rendering-engine]] [[charts-store-atoms]]

- getSubLayers · function · L24-L25 — Extracts the keys from timeseries data that represent sublayers, excluding the date and count fields.
- getEdges · function · L27-L39 — Adjusts the y-axis edge coordinates for visualization to ensure minimum visibility when values are larger than their rendered height.
- TimebarStackedActivity · function · L41-L116 — Renders a stacked activity visualization by transforming timeseries data into polygon layers positioned relative to a timeline origin.
