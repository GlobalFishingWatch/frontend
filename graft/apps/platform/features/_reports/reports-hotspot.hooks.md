# apps/platform/features/_reports/reports-hotspot.hooks.ts · [[client-side-deduplication-memoization]] [[hotspot-computation]]

This module exports React hooks for managing hotspot geometry computation and UI controls in the reports feature, coordinating state updates with filtered report data.

- useComputeReportHotspot · function · L22-L50 — Drives the side-effect that computes a polygon geometry representing the spatial hotspot of filtered report features based on enabled settings and buffer parameters.
- useHotspotSettings · function · L53-L80 — Provides read access to hotspot settings and memoized callbacks to dispatch updates for enabled state, buffer area, and buffer unit.
