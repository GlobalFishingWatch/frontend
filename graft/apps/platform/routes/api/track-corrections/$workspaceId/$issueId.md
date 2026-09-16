# apps/platform/routes/api/track-corrections/$workspaceId/$issueId.ts · [[google-sheets-data-persistence]] [[vessel-tracking-corrections-system]]

Handles POST requests to add comments to track correction issues, validating request origin and required comment fields before persisting the comment.

- ErrorAPIResponse · type · L8-L11 — Type definition for error API responses with success status and error message.
- GetIssueDetailAPIResponse · type · L13-L13 — Type alias for track correction issue detail API responses.
- APIResponse · type · L15-L15 — Union type representing all possible API response formats for this endpoint.
