# libs/responsive-visualizations/src/types.ts · [[polymorphic-chart-data-value-shapes]] [[responsive-visualizations-type-system]]

- ResponsiveVisualizationMode · type · L1-L1 — Discriminates between individual and aggregated rendering modes for visualizations.
- ResponsiveVisualizationChart · type · L3-L3 — Defines available chart types for responsive visualizations.
- ResponsiveVisualizationKey · type · L5-L5 — Type alias for object keys in visualization data structures.
- ResponsiveVisualizationLabel · type · L7-L7 — Type alias for human-readable labels in visualization items.
- ResponsiveVisualizationIndividualValue · type · L8-L8 — Defines the schema for individual mode values as flexible key-value objects.
- ResponsiveVisualizationAggregatedObjectValue · type · L9-L13 — Structures aggregated metric data with optional display properties and a numeric value.
- ResponsiveVisualizationAggregatedValue · type · L15-L16 — Allows aggregated values to be either plain numbers or objects with metadata.
- ResponsiveVisualizationValue · type · L18-L24 — Conditional type that resolves to the appropriate value type based on visualization mode.
- ResponsiveVisualizationAggregatedItem · type · L26-L29 — Defines the shape of a single aggregated visualization item with keys and values.
- ResponsiveVisualizationIndividualItem · type · L30-L33 — Defines the shape of a single individual visualization item with keys and value arrays.
- ResponsiveVisualizationItem · type · L35-L37 — Generic wrapper type for visualization items with optional data shape parameter.
- ResponsiveVisualizationData · type · L39-L49 — Top-level type for visualization datasets that resolves to typed arrays based on mode.
