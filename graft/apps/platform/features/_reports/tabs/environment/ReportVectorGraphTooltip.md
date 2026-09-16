# apps/platform/features/_reports/tabs/environment/ReportVectorGraphTooltip.tsx · [[environment-graph-rendering]]

Renders a polar graph tooltip displaying wind or current direction, speed, and frequency data from Fourwings features at a hovered timestamp.

- TooltipData · type · L21-L27 — Type definition for tooltip state holding directional vector properties including direction, count, force, and screen coordinates.
- metersPerSecondToKnots · function · L36-L38 — Utility function that converts wind or current speed from meters per second to nautical knots using the standard conversion factor.
- ReportVectorGraphTooltip · function · L40-L269 — React component that visualizes directional force vectors in a polar coordinate system, aggregating feature data by direction bins and rendering an interactive SVG graph with cardinal direction labels.
