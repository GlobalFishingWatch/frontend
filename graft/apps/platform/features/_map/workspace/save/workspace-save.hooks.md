# apps/platform/features/_map/workspace/save/workspace-save.hooks.ts · [[workspace-save-edit-modal-subsystem]]

React hooks for managing workspace save modals and timerange configuration in the map workspace feature.

- useSaveWorkspaceModalConnect · function · L23-L44 — Connects workspace save/create modal open state and dispatch actions to Redux, returning the appropriate modal state based on the modal id.
- useSaveWorkspaceTimerange · function · L48-L120 — Manages workspace timerange configuration state (dynamic vs static) and handles updates to timerange mode and days-from-latest values with workspace name synchronization.
