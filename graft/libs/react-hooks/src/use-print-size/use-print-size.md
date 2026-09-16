# libs/react-hooks/src/use-print-size/use-print-size.ts · [[react-hooks-library]] [[react-hooks-responsive-behavior]]

Module providing React hooks and utilities to calculate and retrieve print-friendly dimensions based on CSS variables and device pixel ratios.

- getCSSVarValue · function · L3-L8 — Retrieves the computed CSS variable value from the document body.
- PrintSizeUnit · type · L19-L22 — Type that represents a print size measurement in both pixels and inches.
- PrintSize · type · L23-L23 — Type that represents the complete print page dimensions with width and height in multiple units.
- getPrintSize · function · L25-L29 — Formats the print size into a CSS page size string when supported, defaulting to landscape orientation.
- usePrintSize · function · L31-L52 — React hook that calculates current window print dimensions accounting for device pixel ratio and timebar height.
