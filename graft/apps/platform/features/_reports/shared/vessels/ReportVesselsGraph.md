# apps/platform/features/_reports/shared/vessels/ReportVesselsGraph.tsx · [[filter-property-mapping-and-query-sync]] [[report-visualization-components]]

Module that renders an interactive bar chart displaying vessel report data grouped by properties like flag, gear type, or vessel type, with tooltips and filtering capabilities.

- ReportGraphTooltipProps · type · L37-L50 — Type definition for tooltip data structure displayed on bar chart hover events.
- ReportBarTooltip · function · L60-L130 — React component that renders aggregated vessel data in a formatted tooltip with support for expanded 'others' category and localized labels.
- ReportGraphTick · function · L132-L201 — React component that renders wrappable x-axis labels with click-to-filter capability for vessel graph categories.
- getTickLabel · function · L142-L159 — Formats axis tick labels by translating empty placeholders and applying field-specific formatting rules (flag, gear type, vessel type).
- onLabelClick · function · L161-L170 — Handles axis label click to apply vessel property filter and reset pagination.
- ReportVesselsGraphProps · type · L203-L211 — Type definition for the report vessels graph component props specifying data sources, visualization configuration, and filter parameters.
- ReportVesselsGraph · function · L213-L265 — Main React component that renders an interactive bar chart displaying vessel counts grouped by property with dual data sources and click-based filtering.
- onBarClick · function · L223-L231 — Handles bar click events to apply vessel property filter and reset page on chart interaction.
