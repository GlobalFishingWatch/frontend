# apps/track-labeler/src/features/timebar/VesselEventsPointsGraphDeckGL.tsx · [[timebar-ui-data-filtering]]

React component that renders a DeckGL scatterplot layer displaying vessel event points with interactive tooltips, color-coded by action type, and positioned along a time-series graph.

- getGradientColor · function · L27-L52 — Interpolates a color across a three-stop gradient (#FF6B6B → #CC4AA9 → #185AD0) based on normalized position values.
- VesselEventsPointsGraphDeckGL · function · L54-L194 — React component that renders vessel direction points on a timeline graph using DeckGL, with interactive tooltips and click handlers for event selection.
- getActionColor · function · L101-L104 — Maps action types to display colors, returning a semi-transparent white for selected items or the project-defined color otherwise.
