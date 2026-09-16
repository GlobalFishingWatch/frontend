# apps/platform/features/_vessels/search/basic/SearchBasicResult.tsx · [[vessel-search-system]]

React component that renders a single vessel search result with identity details, transmission timeline, and interactive selection functionality.

- SearchBasicResultProps · type · L54-L61 — Props interface defining the vessel data, selection state, and highlighting configuration for a search result display.
- SearchBasicResult · function · L63-L353 — Renders a vessel search result card with identity information, identity source tracking, gear types, transmission dates, and an interactive track footprint map when the vessel is hovered.
- onVesselClick · function · L162-L172 — Clears search results and sets the map timerange and bounds when a vessel is clicked in standalone search mode.
