# libs/ui-components/src/solar-status/SolarStatus.tsx · [[css-modules-and-styling-architecture]] [[locale-and-internationalization]] [[memoization-and-performance-optimization]] [[solar-status-display]]

- SolarStatusProps · interface · L12-L21 — Component props interface specifying geographic coordinates, timestamp, locale, and optional styling for the solar status display.
- SolarPhase · interface · L23-L26 — Data structure representing a solar phase with its localized label and corresponding icon type.
- SolarStatus · function · L61-L118 — Computes the current solar phase by comparing timestamp against calculated sunrise, sunset, and nautical twilight times, then renders an icon with a tooltip.
