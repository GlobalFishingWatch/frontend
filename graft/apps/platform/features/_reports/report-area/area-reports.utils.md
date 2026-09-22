# apps/platform/features/_reports/report-area/area-reports.utils.ts · [[area-reports-system-core-logic-selectors]] [[bundle-size-optimization-through-module-isolation]] [[report-locale-and-metadata-formatting]] [[spatial-geometry-and-buffer-operations]]

Utility module providing geographic buffering, date/number formatting, vessel property normalization, and vessel filtering functions for area-based fishing reports.

- tickFormatter · function · L55-L60 — Formats numeric tick values using compact notation for readable chart axis labels.
- formatDate · function · L62-L82 — Converts a DateTime object into a localized string label based on the time interval type (year, month, day, or datetime).
- formatTooltipValue · function · L84-L91 — Formats a numeric value with unit and optional difference prefix for display in tooltips.
- BufferedAreaParams · type · L93-L99 — Type definition for parameters required to buffer an area geometry with configurable distance, unit, and operation mode.
- getBufferedFeature · function · L102-L143 — Generates a buffered polygon feature from an area geometry, optionally applying difference operation to exclude the original area.
- getBufferedArea · function · L146-L168 — Creates a buffered area object with optional antimeridian splitting for accurate global coordinate wrapping.
- getBufferedAreaBbox · function · L170-L185 — Calculates the bounding box of a buffered area feature with wrapped geometry for global coordinate handling.
- parseReportUrl · function · L187-L196 — Extracts report configuration parameters (region, dataset, date range, datasets) from a formatted report URL string.
- normalizeVesselProperties · function · L198-L213 — Transforms vessel identity data into normalized and formatted properties (shipname, geartype, shiptype, flag) for consistent display.
- getVesselsFiltered · function · L217-L277 — Filters and searches vessels by a comma-separated string filter supporting prefix-based property targeting, pipe-separated alternation, and negation with leading dash.
