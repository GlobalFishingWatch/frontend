# apps/platform/hooks/ocean-areas.ts · [[help-system-integration]] [[ocean-areas-api-hook]]

Hook module for searching and retrieving ocean area information via API with debounced calls.

- SearchOceanAreasParams · type · L8-L12 — Type that defines parameters for ocean area search queries including text, locale, and optional area type filters.
- GetOceanAreaNameParams · type · L14-L18 — Type that defines parameters for retrieving ocean area names at a given viewport location with optional EEZ combination.
- searchOceanAreasFn · function · L22-L44 — Async function that posts a search query to the ocean areas API and returns matching results or an empty array on failure.
- getOceanAreaNameFn · function · L46-L68 — Async function that posts viewport coordinates to the ocean areas API to retrieve the area name at that location.
- useOceanAreas · function · L70-L104 — Custom React hook that provides debounced callbacks for searching ocean areas and retrieving area names with a 300ms timeout to prevent excessive API calls.
