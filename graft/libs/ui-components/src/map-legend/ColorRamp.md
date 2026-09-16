# libs/ui-components/src/map-legend/ColorRamp.tsx · [[bucket-calculation-for-discrete-mapping]] [[d3-scale-geojson-integration]] [[map-legend-system]]

- PercentScale · type · L18-L18 — Type alias for a scale function that converts numeric values to percentages, or null if unavailable.
- toPercent · function · L20-L23 — Normalizes a scaled value to a valid percentage by clamping NaN and negative values to zero.
- ColorRampLegendProps · type · L25-L32 — Props interface for the ColorRampLegend component defining layer data, styling, and optional brush configuration.
- ColorRampLegend · function · L34-L264 — Renders an interactive color ramp legend that displays value ranges, optional current value indicator, and brush controls for filtering.
- getValueLabel · function · L168-L178 — Formats numeric value labels with scientific notation by extracting and rendering the exponent as a superscript.
