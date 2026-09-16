# libs/responsive-visualizations/src/charts/types.ts · [[chart-component-props-type-contracts]] [[polymorphic-chart-data-value-shapes]]

Type definitions for responsive visualization charts including interaction callbacks, data key accessors, and configuration props for bar charts and time series.

- ResponsiveVisualizationInteractionCallback · type · L12-L14 — Callback type for handling user interaction events on visualization items.
- ResponsiveVisualizationAggregatedValueKey · type · L16-L17 — Type alias for valid property keys in aggregated mode visualization data objects.
- ResponsiveVisualizationIndividualValueKey · type · L19-L20 — Type alias for valid property keys in individual mode visualization data objects.
- BaseResponsiveChartProps · type · L22-L36 — Base configuration type for responsive charts supporting both aggregated and individual data modes with customizable tooltips, items, and click handlers.
- BarChartLabelInterval · type · L39-L45 — Union type defining valid interval strategies for positioning bar chart axis labels, mirroring recharts' AxisInterval behavior.
- BaseResponsiveBarChartProps · type · L48-L53 — Configuration type for bar chart styling and formatting including color, label rendering, and value formatting.
- BarChartByTypeProps · type · L55-L63 — Generic type for mode-specific bar chart props that specifies which data keys to display, the dataset, and interaction handlers.
- BaseResponsiveTimeseriesProps · type · L66-L72 — Configuration type for time series charts defining temporal bounds, styling, and optional label formatting based on time intervals.
- TimeseriesByTypeProps · type · L74-L81 — Generic type for mode-specific time series props that specifies which data keys to display, the dataset, and interaction handlers.
