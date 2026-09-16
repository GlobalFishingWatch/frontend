# apps/platform/utils/analytics.ts · [[analytics-extraction-utilities]]

Utility module providing functions to extract and format activity analytics data from dataviews and filter configurations.

- getActivitySources · function · L5-L6 — Extracts active dataset IDs from a dataview and returns them as a comma-separated string.
- getActivityFilters · function · L8-L16 — Transforms a filters object into an array of field-value pairs formatted as strings for analytics tracking.
- getEventLabel · function · L18-L18 — Joins an array of strings with pipe separators to create a formatted event label.
