# libs/ui-components/src/map-legend/map-legend.utils.ts · [[map-legend-system]] [[number-formatting-rounding-convention]]

Utility module for formatting and parsing numeric values for map legend display, handling scientific notation, decimal rounding, and human-readable abbreviations (K, M, B).

- parseLegendNumber · function · L6-L11 — Converts a floating-point number to fixed precision, returning integers unchanged and applying scientific notation threshold logic to avoid unwanted exponential notation.
- roundLegendDecimals · function · L13-L18 — Rounds a number to a fixed decimal precision (2 decimal places) for legend display.
- roundLegendNumber · function · L20-L22 — Rounds numbers greater than 1 to the nearest floor value, and applies legend number parsing logic to smaller values.
- FormatLegendValueParams · type · L24-L31 — Configuration object defining parameters for legend value formatting including number, rounding, boundary markers, and divergent scale handling.
- formatLegendValue · function · L32-L63 — Formats a number for map legend display by applying unit abbreviations (B/M/K), handling divergent scales with +/≤/≥ symbols, and rounding to specified decimals.
