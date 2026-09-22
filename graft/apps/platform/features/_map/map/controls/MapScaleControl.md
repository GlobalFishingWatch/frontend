# apps/platform/features/_map/map/controls/MapScaleControl.tsx · [[map-controls-system]] [[viewport-based-coordinate-display]]

React component that displays a clickable scale indicator showing the distance corresponding to the control's width in either nautical miles or kilometers, synchronized with the current map viewport.

- ScaleControlProps · type · L12-L14 — Configuration type for the MapScaleControl component, specifying the optional maximum width in pixels.
- getDecimalRoundNum · function · L16-L19 — Rounds a decimal number to a cleaner magnitude by computing an appropriate power-of-10 multiplier.
- getRoundNum · function · L21-L28 — Rounds a number to a human-readable scale using canonical round values (1, 2, 3, 5, 10) multiplied by a power of 10.
- ScaleUnit · type · L30-L30 — Union type representing the two supported distance units for map scale display: kilometers or nautical miles.
- MapScaleControl · function · L37-L71 — React component that calculates and renders a clickable map scale bar showing distance across the viewport width.
- toggleMeasurement · function · L46-L48 — Toggles the unit of measurement between nautical miles and kilometers.
