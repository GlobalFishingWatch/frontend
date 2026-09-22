# apps/platform/routes/api/track-corrections/$workspaceId/index.ts · [[google-sheets-data-persistence]] [[security-csrf-mitigation-for-public-apis]] [[vessel-tracking-corrections-system]]

File-level module that defines API route handlers for retrieving and creating track correction issues within a workspace, with request validation and error handling.

- ErrorAPIResponse · type · L8-L11 — Type definition for standardized error responses containing a success flag and message.
- CreateIssueAPIResponse · type · L13-L13 — Type alias for the response when creating a new track correction issue.
- GetAllIssuesAPIResponse · type · L14-L14 — Type alias for the response when retrieving all track correction issues for a workspace.
- APIResponse · type · L16-L16 — Union type representing all possible API response formats for track correction endpoints.
