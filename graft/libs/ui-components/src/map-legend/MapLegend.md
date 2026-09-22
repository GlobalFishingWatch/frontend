# libs/ui-components/src/map-legend/MapLegend.tsx · [[legend-type-dispatch-pattern]] [[map-legend-system]]

- MapLegendProps · interface · L19-L26 — Props interface for a single map legend component supporting various legend types with optional styling and value formatting.
- MapLegendsProps · interface · L28-L30 — Props interface for a container component rendering multiple map legends in a wrapper div.
- MapLegend · function · L32-L70 — Routes a legend configuration to the appropriate specialized legend component based on its type (symbols, solid, colorramp, or bivariate).
- MapLegends · function · L72-L86 — Renders a container with multiple map legends, iterating over an array of legend configurations.
