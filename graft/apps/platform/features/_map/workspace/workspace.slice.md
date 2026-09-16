# apps/platform/features/_map/workspace/workspace.slice.ts · [[bundle-size-optimization-through-module-isolation]] [[dataview-and-dataset-loading-integration]] [[password-protected-and-private-workspace-access-control]] [[user-data-and-permissions]] [[workspace-state-orchestration-redux-slice-selectors]]

- LastWorkspaceVisited · type · L76-L78 — Type alias representing a visited workspace navigation entry compatible with TanStack Router for history tracking.
- getPersistedHistoryNavigation · function · L82-L92 — Retrieves workspace navigation history from session storage and safely handles parse errors.
- persistHistoryNavigation · function · L94-L103 — Stores workspace navigation history to session storage with error handling.
- WorkspaceSliceState · interface · L105-L116 — Redux state shape holding workspace data, loading status, errors, reports, passwords, and navigation history.
- RejectedActionPayload · type · L130-L133 — Type defining the payload structure returned when workspace fetch operations fail with error details.
- getDefaultWorkspace · function · L148-L161 — Loads and returns the environment-appropriate default workspace configuration with production fallback.
- fetchWorkspaceByIdSafe · function · L163-L172 — Safely fetches a workspace by ID from the API with graceful error handling and early return on fetch failures.
- FetchWorkspacesThunkParams · type · L174-L179 — Type defining parameters for initiating workspace fetch including ID, password, report reference, and refresh flag.
- matchUserDataset · function · L348-L348 — Regex pattern matcher identifying user-specific datasets by their timestamp-suffixed ID format.
- SaveWorkspaceThunkProperties · type · L492-L500 — Type defining required and optional properties for saving a workspace including name, access controls, and time range.
- saveWorkspace · function · L522-L553 — Persists workspace configuration to the API with retry logic for transient failures.
- UpdateWorkspaceThunkRejectError · type · L560-L562 — Type representing a workspace update error response with a flag indicating password validation failure.
- UpdateCurrentWorkspaceThunkParams · type · L564-L568 — Type defining parameters for updating the current workspace including optional password change and access modifications.
