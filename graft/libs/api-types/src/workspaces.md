# libs/api-types/src/workspaces.ts · [[api-type-contracts]]

Type definitions for workspace configuration including access control, viewport settings, and API app names.

- ApiAppName · type · L3-L3 — Enumerated type defining supported applications that workspaces can be scoped to.
- WorkspaceViewAccessType · type · L9-L12 — Union type defining all valid access levels for viewing workspace content.
- WorkspaceEditAccessType · type · L13-L14 — Union type defining valid access levels for editing workspace content, excluding public access.
- WorkspaceViewport · type · L16-L20 — Type defining geographic viewport parameters for centering and zooming workspace map views.
- OwnerType · type · L22-L22 — Union type distinguishing workspace ownership between system super-users and regular user identifiers.
- Workspace · type · L24-L41 — Complete workspace data model with metadata, access controls, viewport, time range, state, and associated dataviews.
- WorkspaceUpsert · type · L43-L46 — Workspace data model for insert/update operations that omits server-generated and access-control fields.
