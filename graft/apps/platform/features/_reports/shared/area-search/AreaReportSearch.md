# apps/platform/features/_reports/shared/area-search/AreaReportSearch.tsx · [[area-search-navigation]] [[graceful-degradation-fallback-behavior]]

React component providing autocomplete search for ocean areas to navigate users to detailed area reports.

- getItemLabel · function · L22-L28 — Formats an ocean area object into a display label combining the area name and localized type.
- AreaReportSearch · function · L30-L143 — Main component rendering a searchable dropdown input to select and navigate to ocean area reports.
- updateMatchingAreas · function · L39-L50 — Queries the ocean areas backend with the input string and updates the matching results list, capped at maximum.
- onInputChange · function · L52-L60 — Handles input value changes by clearing selections on empty input or fetching fresh matching areas for non-empty input.
- onSelectResult · function · L62-L75 — Processes area selection, navigates to the area report, and tracks the search event for analytics.
- onInputBlur · function · L87-L93 — Clears selection and input when focus leaves the field if the typed value does not match the selected item.
- handleKeyDown · function · L97-L105 — Clears all search state and closes the dropdown when the Escape key is pressed.
