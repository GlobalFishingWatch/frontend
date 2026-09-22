# apps/platform/features/_map/sidebar/buttons/SaveWorkspaceButton.tsx · [[map-sidebar-navigation-buttons]] [[modal-workflows]] [[router-integration-navigation]]

React component that renders a save/save-as button for workspaces with conditional access control based on ownership and password access.

- SaveWorkspaceButton · function · L23-L131 — Renders a workspace save button with different UI patterns depending on whether the user owns the workspace, with conditional access checks and modal dispatch actions.
- onSaveClick · function · L36-L42 — Opens the edit workspace modal if the user has edit access, otherwise does nothing.
- onSaveAsClick · function · L44-L48 — Opens the create workspace modal and closes the edit workspace modal to enable save-as functionality.
- onOpenChange · function · L50-L56 — Manages the popover open/close state and closes both workspace modals when the popover is closed.
