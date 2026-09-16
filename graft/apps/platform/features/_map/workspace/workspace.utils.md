# apps/platform/features/_map/workspace/workspace.utils.ts · [[password-protected-and-private-workspace-access-control]] [[tiered-configuration-fallback-pattern]] [[workspace-utilities-and-validation]]

Utility module providing workspace data transformations, access control checks, and report query cleaning functions.

- parseUpsertWorkspace · function · L22-L28 — Extracts mutable workspace properties by removing immutable fields (id, ownerId, createdAt, ownerType, viewAccess) for upsertion.
- isPrivateWorkspaceNotAllowed · function · L30-L37 — Validates that a private workspace has at least one dataview instance to prevent empty private workspaces.
- getWorkspaceLabel · function · L39-L46 — Generates a workspace display label with security icon prefixes for private or password-protected workspaces.
- getNextColor · function · L48-L64 — Selects the least-used color from a palette to balance color distribution across multiple items.
- cleanReportQuery · function · L66-L84 — Removes report-specific state from query params and cleans dataview instances using specialized cleaner functions.
- cleanReportPayload · function · L91-L95 — Removes reportId from a payload and replaces report-related parameters with empty values.
- getWorkspaceReport · function · L97-L103 — Extracts workspace metadata and state while removing access/timing fields and injecting daysFromLatest parameter.
