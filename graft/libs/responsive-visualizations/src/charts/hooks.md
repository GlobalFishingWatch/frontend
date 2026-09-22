# libs/responsive-visualizations/src/charts/hooks.ts · [[fourwings-interval-based-data-alignment]] [[progressive-data-loading-pattern]] [[responsive-chart-hooks-orchestration]] [[responsive-dimension-tracking-via-resizeobserver]] [[value-key-normalization-dependency-management]]

Module providing React hooks for managing responsive visualization data, dimensions, and layout logic with support for both individual and aggregated chart rendering modes.

- useValueKeys · function · L24-L37 — Normalizes a single or array of visualization value keys into a consistent array format with memoization.
- ResponsiveVisualizationContainerRef · type · L39-L39 — Type alias for a React ref pointing to an optional HTML container element.
- useResponsiveDimensions · function · L40-L59 — Tracks and updates container width and height using ResizeObserver when the container dimensions change.
- UseResponsiveVisualizationDataProps · type · L61-L72 — Configuration type specifying data sources, filters, and key selectors for responsive visualization data loading.
- useResponsiveVisualizationData · function · L74-L183 — Loads and evaluates aggregated or individual data based on viewport dimensions and support constraints, with fallback logic.
- useResponsiveVisualization · function · L185-L203 — Combines responsive dimensions and data loading to provide complete visualization state based on container size.
