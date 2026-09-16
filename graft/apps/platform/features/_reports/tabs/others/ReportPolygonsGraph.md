# apps/platform/features/_reports/tabs/others/ReportPolygonsGraph.tsx · [[context-layer-interaction]] [[polygon-containment-and-overlap-metrics]] [[report-others-tab-system]]

Module that renders a polygon statistics report component with area coverage metrics, overlay counts, and top area rankings for geographic datasets.

- formatArea · function · L31-L35 — Formats area measurements by converting square kilometers to appropriate units (square meters if under 1 km², otherwise km²) with localized number formatting.
- ReportPolygonsGraph · function · L37-L184 — React component that displays polygon report statistics including containment counts, area coverage, and an interactive list of top areas with hover-based highlighting.
