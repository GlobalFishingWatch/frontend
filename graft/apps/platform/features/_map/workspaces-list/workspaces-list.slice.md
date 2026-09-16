# apps/platform/features/_map/workspaces-list/workspaces-list.slice.ts · [[workspaces-list-management-redux-slice-selectors]]

Redux slice managing the state, thunks, and selectors for a list of workspaces including fetching, creating, updating, and deleting workspace entities.

- AppWorkspace · type · L25-L25 — Type alias for a workspace object with application-specific state and category configuration.
- FetchWorkspacesThunkParams · type · L27-L31 — Parameter type for the fetch workspaces thunk specifying optional app name, workspace ids, or user id filters.
- UpdateWorkspaceThunkParams · type · L115-L119 — Parameter type for updating a workspace with optional password fields for authentication.
- WorkspaceSliceState · type · L174-L174 — Type definition for the workspace slice state structure containing async reducer state.
- selectWorkspaces · function · L195-L197 — Selector that retrieves all workspaces from the slice state.
- selectWorkspaceListStatus · function · L198-L198 — Selector that retrieves the current loading or error status of the workspace list.
- selectWorkspaceListStatusId · function · L199-L199 — Selector that retrieves the status identifier associated with the workspace list operation.
