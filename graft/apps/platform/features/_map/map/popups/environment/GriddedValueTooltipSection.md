# apps/platform/features/_map/map/popups/environment/GriddedValueTooltipSection.tsx · [[conditional-detail-rendering]] [[dataview-metadata-resolution]] [[environmental-data-tooltips]] [[number-localization]]

This file provides a React component that renders tooltips displaying gridded environmental data values with units and optional bathymetry disclaimers extracted from fourwings heatmap features.

- GriddedValueTooltipSectionProps · type · L19-L22 — Type definition for the props passed to GriddedValueTooltipSection, specifying gridded feature data and visibility control.
- parseEnvironmentalValue · function · L24-L32 — Utility function that normalizes and formats environmental measurement values to two decimal places with thousands separators.
- GriddedValueTooltipSection · function · L34-L87 — React component that maps gridded environmental features to formatted popup sections with proper iconography, units, and optional bathymetry warnings.
