# apps/platform/features/_vessels/vessel/areas/VesselAreas.tsx · [[map-integration-layer]] [[vessel-areas-visualization]]

Displays a vessel's activities grouped by geographic areas (EEZ, FAO, RFMO, MPA) with interactive bar charts showing event type distributions per region.

- VesselAreasProps · type · L46-L48 — Type definition for VesselAreas component props specifying the area layers visibility update callback.
- AreaTick · function · L50-L92 — Renders an interactive Y-axis tick for area charts that allows users to highlight and fit map bounds to events in that area.
- AreaTooltip · function · L94-L115 — Formats and displays event type counts in a tooltip for the area bar chart.
- VesselAreas · function · L117-L299 — Main component that renders a selectable area type filter and stacked bar chart of vessel events grouped by geographic area, with data warning modal support.
