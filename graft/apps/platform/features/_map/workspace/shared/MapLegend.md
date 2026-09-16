# apps/platform/features/_map/workspace/shared/MapLegend.tsx · [[analytics-and-user-event-tracking]] [[map-legend-and-color-ramp-filtering]] [[value-transformation-and-localization]]

Module that exports a wrapper component to render customizable legend for map dataview layers with support for bivariate, symbols, and gradient legends.

- LegendScale · type · L22-L27 — Data structure that holds the scale configuration for a map legend including domain values, color ranges, sublayer index, and legend type.
- getLegendLabelTranslated · function · L29-L55 — Translates and formats legend unit labels with grid area calculation for square-based measurements.
- MapLegendWrapper · function · L57-L171 — React component that renders a map legend UI with conditional brush filtering, label formatting, and support for different legend types (bivariate, symbols, gradient).
