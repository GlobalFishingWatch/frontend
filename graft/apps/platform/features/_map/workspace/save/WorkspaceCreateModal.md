# apps/platform/features/_map/workspace/save/WorkspaceCreateModal.tsx · [[dataview-instance-connector]] [[router-query-parameter-management]] [[workspace-save-edit-modal-subsystem]]

Modal dialog for creating and saving a workspace with name, time range, view/edit access control, and optional password protection.

- CreateWorkspaceModalProps · type · L52-L55 — Type definition for the props passed to the CreateWorkspaceModal component.
- CreateWorkspaceModal · function · L57-L343 — Main modal component that handles workspace creation with form state management, validation, and navigation after successful save.
- onClose · function · L93-L95 — Closes the workspace creation modal by dispatching the modal state to false.
- onNameChange · function · L97-L99 — Updates the workspace name state when the user types in the name input field.
- setDefaultWorkspaceName · function · L101-L140 — Generates and sets a default workspace name based on ocean area location and current timerange configuration.
- getWorkspaceError · function · L148-L161 — Validates workspace creation form and returns error message if name is missing or password requirements are not met.
- createWorkspace · function · L163-L219 — Saves the new workspace with validated form data and navigates to the appropriate route based on location type.
- onDaysFromLatestChange · function · L221-L226 — Updates the days from latest value and regenerates workspace name when the dynamic timerange days input changes.
- onSelectTimeRangeChange · function · L228-L233 — Updates the selected timerange option and regenerates workspace name when the timerange dropdown selection changes.
- handleSubmit · function · L235-L238 — Form submission handler that prevents default browser behavior and triggers workspace creation.
