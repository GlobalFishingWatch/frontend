# apps/platform/features/_reports/tabs/others/ReportPolygonsEvolution.tsx · [[report-others-tab-system]] [[report-time-series-visualization-subsystem]]

React component that renders an evolution chart tracking polygon containment and overlapping status over time with formatted tooltips and adaptive intervals.

- PolygonsEvolutionTooltip · function · L24-L64 — Custom tooltip component that formats and displays contained and overlapping polygon counts for a specific time chunk with localized labels.
- ReportPolygonsEvolution · function · L66-L180 — Main export component that computes time domain bounds, formats evolution data with safeguarded padding, and renders a composed chart tracking polygon status across sublayers.
