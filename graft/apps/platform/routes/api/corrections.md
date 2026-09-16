# apps/platform/routes/api/corrections.ts · [[google-sheets-data-persistence]] [[public-data-collection-apis]] [[security-csrf-mitigation-for-public-apis]]

API route handler for vessel correction submissions that receives correction data and appends it to a Google Sheet for review and processing.

- mapDataToHeader · function · L12-L58 — Maps correction submission data fields to spreadsheet column headers, applying source-specific field mappings for registry or self-reported vessel identity sources.
- ApiResponse · type · L60-L64 — Standard response type for the corrections API indicating success status, message, and optional correction data payload.
