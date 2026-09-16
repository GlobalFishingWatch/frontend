# apps/platform/features/_map/workspace/shared/LayerSchemaFilter.utils.ts · [[filter-type-and-unit-transformation-patterns]] [[layer-filter-and-properties-components]] [[schema-based-filtering]] [[value-transformation-and-localization]]

Utility module providing value transformation, labeling, and formatting functions for schema filters in dataview configurations.

- showSchemaFilter · function · L5-L7 — Determines whether a schema filter should be displayed based on enabled status and available options.
- TransformationUnit · type · L9-L9 — Type alias defining supported measurement units for filter value transformations.
- Transformation · type · L11-L15 — Type defining the structure for value transformations with bidirectional conversion and label generation.
- getValueByUnit · function · L33-L43 — Converts a value between units (minutes/hours/km) in either direction, falling back to numeric parsing.
- getFilterValueTransform · function · L55-L56 — Retrieves the transformation configuration for a given filter ID.
- getFilterValueById · function · L58-L68 — Transforms a filter value based on its filter ID and direction, with fallback to direct numeric parsing.
- getFilterLabelById · function · L70-L71 — Returns a localized label for a filter, using filter-specific transformation labels when available.
- getUnitLabel · function · L73-L77 — Retrieves the localized display label for a measurement unit.
- getValueLabelByUnit · function · L79-L87 — Formats a numeric value with optional localized unit label for display.
- getLabelWithUnit · function · L89-L101 — Combines a translated label with an optional unit label, with fallback to the untranslated label.
- getSchemaValueRounded · function · L103-L105 — Rounds a numeric value to a specified number of decimal places.
