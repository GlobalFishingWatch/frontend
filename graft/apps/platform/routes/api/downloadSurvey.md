# apps/platform/routes/api/downloadSurvey.ts · [[google-sheets-data-persistence]] [[public-data-collection-apis]] [[security-csrf-mitigation-for-public-apis]]

API route handler that receives survey feedback data, validates it, and appends sanitized responses to a Google Sheet.

- ApiResponse · type · L8-L12 — Response structure for survey download operations indicating success status, a message, and optional payload.
