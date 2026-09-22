# apps/port-labeler/src/features/search/search.hooks.ts · [[search-point-discovery]]

Exports a custom React hook that provides search functionality for filtering and centering port positions, anchorages, and subareas across the labeler interface.

- Dictionary · type · L16-L16 — Generic type alias for a string-keyed record mapping any string to values of type T.
- useSearchConnect · function · L18-L106 — Custom hook that provides a searchPoints function to filter and display port, subarea, anchorage, or destination records based on search terms.
- compareProperty · function · L29-L33 — Checks whether a search term matches any field value by case-insensitive substring inclusion.
- filterFiels · function · L35-L59 — Filters port records by search term against either country-specific field values with optional name mapping or main search properties.
- searchPoints · function · L61-L101 — Executes a search by type (destination, port, subarea, or anchorage), filters matching records, centers the map on results, and updates Redux state with selected point IDs.
