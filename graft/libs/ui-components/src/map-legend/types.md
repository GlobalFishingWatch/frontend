# libs/ui-components/src/map-legend/types.ts · [[legend-type-dispatch-pattern]] [[map-legend-system]]

Defines TypeScript types and enums for map legend UI components, including variants for solid colors, symbols, color ramps, and bivariate legends.

- LegendType · enum · L3-L9 — Enumeration of supported legend visualization types.
- BaseLegend · type · L11-L19 — Base type defining common properties shared across all legend variants.
- UILegendSolid · type · L21-L25 — Legend variant for displaying a single uniform color with optional current value.
- UILegendSymbols · type · L27-L33 — Legend variant for displaying multiple symbols and colors mapped to numeric values.
- UILegendColorRamp · type · L35-L41 — Legend variant for displaying a color gradient across a range of numeric values.
- UILegendBivariate · type · L43-L48 — Legend variant for displaying a two-dimensional mapping of colors to pairs of numeric values.
- UILegend · type · L50-L50 — Union type representing any supported legend variant.
