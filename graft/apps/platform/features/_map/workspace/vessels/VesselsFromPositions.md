# apps/platform/features/_map/workspace/vessels/VesselsFromPositions.tsx · [[vessels-section-management]]

React component that displays vessels detected in the current map viewport, aggregating position data from activity and detection layers with interactive hover highlighting.

- VesselFromPosition · type · L34-L39 — Type definition for a vessel extracted from position data, containing id, optional ship name, aggregated value metric, and associated datasets.
- VesselsFromPositions · function · L41-L200 — React component that fetches and displays a list of on-screen vessels from fourwings activity and detection layers, filtered to exclude already-pinned vessels and capped at a maximum display count.
- setHighlightVessel · function · L58-L73 — Callback function that syncs vessel highlighting state across both activity and detections fourwings map layers.
