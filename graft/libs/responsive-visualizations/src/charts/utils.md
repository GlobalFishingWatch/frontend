# libs/responsive-visualizations/src/charts/utils.ts · [[color-accessibility]]

Utility module providing functions to compute color contrast metrics and adjust colors to meet accessibility standards.

- relativeLuminance · function · L3-L10 — Computes the relative luminance of a color in linear sRGB space using the WCAG formula.
- contrastWCAG · function · L12-L18 — Calculates the WCAG contrast ratio between two colors based on their relative luminance values.
- ensureMinimumContrast · function · L20-L36 — Iteratively darkens a color until it achieves a minimum contrast ratio against a background color.
- getContrastSafeColor · function · L38-L76 — Returns a color adjusted for accessibility by ensuring sufficient contrast against a background, with different thresholds for text versus line visualizations.
