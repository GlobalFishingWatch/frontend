# apps/platform/routes/api/feedback.ts · [[google-sheets-data-persistence]] [[public-data-collection-apis]] [[security-csrf-mitigation-for-public-apis]]

API route handler that processes and persists user feedback submissions to Google Sheets based on feedback type.

- FeedbackDataType · type · L11-L11 — Discriminated type that categorizes feedback submissions into feedback, error reports, or vessel corrections.
- FeedbackForm · type · L12-L29 — Data structure that encapsulates a complete feedback submission with type, timestamp, user metadata, and contextual details.
- ApiResponse · type · L31-L35 — Standard response envelope that communicates the success status, message, and optional echoed feedback data back to the client.
