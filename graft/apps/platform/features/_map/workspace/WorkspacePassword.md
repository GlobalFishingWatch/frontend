# apps/platform/features/_map/workspace/WorkspacePassword.tsx · [[password-protected-and-private-workspace-access-control]] [[workspace-user-interface-components]]

A React component that handles password authentication for accessing password-protected workspaces.

- WorkspacePassword · function · L22-L90 — React component that displays a password input form and handles workspace authentication with password validation and error messaging.
- handlePasswordChange · function · L32-L34 — Updates the local password state when the user types in the password input field.
- handleSubmit · function · L36-L53 — Validates password length, dispatches workspace fetch with the password, and updates password state based on the server response indicating whether the password was correct.
