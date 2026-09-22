# apps/platform/server/api/track-corrections/utils.ts · [[data-type-parsing-from-sheets]] [[vessel-tracking-corrections-system]]

Utility module for parsing and transforming track correction data from Google Sheets rows into typed domain objects.

- parseIssueResolved · function · L11-L13 — Converts a string value to a boolean representing whether an issue has been marked as resolved.
- parseIssueComment · function · L15-L30 — Transforms a Google Spreadsheet row into a structured TrackCorrectionComment object by extracting and parsing relevant fields.
- parseIssueRow · function · L32-L50 — Transforms a Google Spreadsheet row into a structured TrackCorrection object by extracting and type-converting geographic and metadata fields.
- getSheetTab · function · L52-L58 — Retrieves a sheet tab from a spreadsheet document by title, throwing an error if the tab does not exist.
