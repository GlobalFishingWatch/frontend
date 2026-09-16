# apps/platform/features/_map/workspace/shared/LayerSchemaFilter.tsx · [[filter-type-and-unit-transformation-patterns]] [[layer-filter-and-properties-components]]

React component that renders schema-based layer filters with support for range, number, boolean, and multi-select filter types.

- LayerSchemaFilterProps · type · L36-L43 — Type definition for props passed to the LayerSchemaFilter component, including callbacks for filter selection, operation changes, removal, and cleanup.
- TransformationUnit · type · L45-L45 — Union type for supported time and distance unit transformations used to convert filter values.
- Transformation · type · L49-L53 — Type defining value transformation functions and label getter for converting between internal and display unit representations.
- getValueByUnit · function · L71-L86 — Converts filter values between different units (minutes/hours/km) using appropriate transformation functions based on unit and filter ID.
- getFilterOperatorOptions · function · L88-L99 — Returns a standardized list of filter operator choices (include/exclude) for use in filter UI controls.
- getSliderConfigBySchema · function · L101-L128 — Derives slider configuration (min, max, steps) from filter schema options, supporting value rounding for ranges larger than 1.
- getRangeLimitsBySchema · function · L130-L148 — Extracts and normalizes the minimum and maximum boundary values from filter schema options for range validation.
- getRangeBySchema · function · L150-L183 — Computes the current range values for a filter based on selected options, falling back to schema limits and applying rounding where appropriate.
- LayerSchemaFilter · function · L187-L375 — Renders different filter UI components (range slider, number slider, boolean select, or multi-select) based on filter type, handling value transformations and user interactions.
