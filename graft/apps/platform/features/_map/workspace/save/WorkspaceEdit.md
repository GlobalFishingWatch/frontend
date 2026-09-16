# apps/platform/features/_map/workspace/save/WorkspaceEdit.tsx · [[workspace-save-edit-modal-subsystem]]

- EditWorkspaceProps · type · L41-L45 — Props type that specifies a workspace object, optional list context flag, and optional callback when editing completes.
- EditWorkspace · function · L47-L240 — React component that renders a form to edit workspace metadata, permissions, and security settings with validation.
- updateWorkspace · function · L73-L128 — Async handler that dispatches workspace update thunk, validates password correctness on response, and navigates or invokes callback.
- onDaysFromLatestChange · function · L130-L135 — Event handler that updates the days-from-latest numeric input and syncs the workspace name if the handler modifies it.
- onSelectTimeRangeChange · function · L137-L142 — Dropdown change handler that switches time range mode and synchronizes the workspace name state when needed.
- handleSubmit · function · L143-L146 — Form submission handler that prevents default behavior and triggers the workspace update workflow.
