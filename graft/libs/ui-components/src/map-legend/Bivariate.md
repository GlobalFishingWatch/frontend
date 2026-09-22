# libs/ui-components/src/map-legend/Bivariate.tsx · [[bucket-calculation-for-discrete-mapping]] [[map-legend-system]]

Module that exports a BivariateLegend component for rendering a two-variable map legend with color-coded grid visualization.

- BivariateLegendProps · type · L11-L16 — Type definition for the props passed to the BivariateLegend component, specifying the layer data, optional styling, and rendering configuration.
- getBucketIndex · function · L36-L50 — Determines which break bucket a numeric value falls into by finding the first break threshold it does not exceed.
- getBivariateValue · function · L52-L80 — Converts a pair of real values into a single bivariate bucket index by mapping each value to a row and column position in a 4x4 grid.
- BivariateRect · function · L85-L104 — SVG rect component that renders a single colored square in the bivariate legend grid at a position determined by its index.
- BivariateLegend · function · L121-L203 — Main React component that renders a bivariate map legend with an SVG grid of colors, value labels, directional arrows, and highlights the current data bucket.
