# apps/platform/server/api/utils/spreadsheets.ts · [[google-sheets-api-integration]]

Utility module providing authenticated Google Spreadsheet document loading and caching functionality for track-correction features.

- loadSpreadsheetDoc · function · L9-L25 — Authenticates with Google Sheets API using service account credentials and loads a spreadsheet document by its ID.
- loadSpreadsheetDocByWorkspace · function · L27-L38 — Resolves a workspace ID to its corresponding spreadsheet ID and loads the authenticated spreadsheet document.
