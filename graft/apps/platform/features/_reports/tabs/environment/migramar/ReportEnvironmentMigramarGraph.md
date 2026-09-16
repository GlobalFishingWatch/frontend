# apps/platform/features/_reports/tabs/environment/migramar/ReportEnvironmentMigramarGraph.tsx · [[migramar-environmental-analysis]]

- getCategory · function · L27-L38 — Determines the risk category (1-5) of a value by comparing it against percentile thresholds (P20, P40, P60, P80).
- parseBaselineYears · function · L40-L47 — Parses a dash-separated year range string into an array of two numeric years for baseline visualization.
- getYearsFromRow · function · L49-L54 — Extracts and sorts all year keys from a MigramarRow that match the year regex pattern.
- ChartPoint · type · L56-L62 — Data structure representing a single point on the Migramar chart with year, status, category, trend, and GAMM values.
- CustomDot · function · L64-L76 — Renders a colored circular dot on the chart, with color determined by the data point's category or default primary blue.
- CustomTooltip · function · L78-L103 — Displays a custom tooltip showing the year, status (AVP), category indicator, and GAMM value when hovering over chart points.
- ReportEnvironmentMigramarGraph · function · L105-L223 — Main component that transforms Migramar row data into chart points and renders a multi-line chart with baseline reference area and dynamic legend.
