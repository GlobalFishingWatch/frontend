# apps/platform/features/_map/workspace/workspace.selectors.ts · [[password-protected-and-private-workspace-access-control]] [[router-state-and-navigation]] [[tiered-configuration-fallback-pattern]] [[user-data-and-permissions]] [[workspace-state-orchestration-redux-slice-selectors]]

Redux selectors for workspace state management, including password protection, data views, timerange, and fetch parameters.

- selectWorkspace · function · L47-L47 — Extracts the workspace data object from Redux state.
- selectWorkspaceReportId · function · L48-L48 — Extracts the report ID associated with the current workspace.
- selectWorkspacePassword · function · L49-L49 — Extracts the workspace password from state for authentication validation.
- selectSuggestWorkspaceSave · function · L50-L50 — Extracts the flag indicating whether to prompt the user to save workspace changes.
- selectWorkspaceError · function · L51-L51 — Extracts error information from the workspace loading state.
- selectWorkspaceStatus · function · L52-L52 — Extracts the loading status of the workspace async operation.
- selectWorkspaceRefreshStatus · function · L53-L53 — Extracts the status of the workspace refresh operation.
- selectIsWorkspaceRefreshing · function · L54-L55 — Determines whether the workspace is currently being refreshed.
- selectWorkspaceHistoryNavigation · function · L56-L57 — Extracts the navigation history within workspace routes.
- selectWorkspaceCustomStatus · function · L58-L58 — Extracts custom status metadata for the workspace.
- isWorkspacePasswordProtected · function · L144-L153 — Determines if a workspace requires a password by checking access type and dataview availability.
- WorkspaceProperty · type · L194-L194 — Type alias for required workspace state properties extracted by the generic selector factory.
- selectWorkspaceStateProperty · function · L201-L213 — Factory function that creates selectors for workspace state properties with fallback resolution from URL, workspace state, and user settings.
- WorkspaceFetchParams · type · L237-L237 — Type definition for parameters needed to fetch a workspace, including optional report ID.
- getDefaultWorkspaceFetchParams · function · L239-L246 — Determines if default workspace should be fetched by checking if a different workspace is currently loaded.
- getReportWorkspaceFetchNeeded · function · L248-L257 — Determines if a workspace fetch is required when navigating to a standalone report by comparing current and target report IDs.
