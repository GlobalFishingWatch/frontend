# apps/platform/features/_map/map/controls/MiniGlobeInfo.tsx · [[map-controls-system]] [[viewport-based-coordinate-display]]

A React component that displays the current map viewport coordinates and ocean area name, with the ability to toggle between DMS and decimal coordinate formats.

- MiniGlobeInfo · function · L13-L53 — React component that renders viewport coordinates in switchable DMS/decimal format and fetches the ocean area name for the current viewport location.
- updateAreaName · function · L20-L36 — Async function that queries the ocean area name for a given viewport and locale, handling errors and updating component state.
