# apps/platform/features/_map/map/popups/vessels/VesselTracksTooltipSection.tsx · [[dataviews-datasets-state]] [[feature-grouping-pattern]] [[map-interaction-hooks]] [[map-popup-system]] [[track-correction-workflow]]

Exports a React component that renders tooltip sections displaying vessel track information with interactive features for reporting track corrections.

- VesselTracksTooltipSectionProps · type · L44-L47 — Type definition for the props passed to the vessel tracks tooltip section component.
- VesselTracksTooltipRow · function · L49-L187 — React component that renders a single vessel track row with vessel details, coordinates, speed, depth, and a track correction reporting button conditional on workspace permissions and user state.
- VesselTracksTooltipSection · function · L189-L235 — React component that groups vessel track features by dataview layer and renders them as organized popup sections with dataset labels and track rows.
