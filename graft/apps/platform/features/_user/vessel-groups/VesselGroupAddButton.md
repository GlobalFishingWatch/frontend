# apps/platform/features/_user/vessel-groups/VesselGroupAddButton.tsx · [[guest-user-authorization]] [[lazy-vessel-metadata-resolution]] [[vessel-groups-ui-layer]]

React component module providing a button UI for adding vessels to groups, with guest-user restrictions and vessel-count validation.

- VesselGroupAddButtonProps · type · L27-L34 — Configuration type for the VesselGroupAddButton component specifying vessels to add, datasets to resolve, and callbacks.
- VesselGroupAddButtonToggleProps · type · L36-L44 — Configuration type for the VesselGroupAddActionButton controlling its appearance, size, and interaction behavior.
- VesselGroupAddActionButton · function · L46-L84 — Renders a button that allows users to add vessels to vessel groups, with validation for guest users and vessel count limits.
- VesselGroupAddButton · function · L86-L150 — Orchestrates the workflow for adding vessels to vessel groups by resolving vessel data, coordinating updates, and invoking callbacks.
