# apps/platform/features/_user/vessel-groups/vessel-groups.hooks.ts · [[vessel-groups-management-system]]

Provides React hooks for managing vessel group operations including dataview instantiation, options formatting, vessel addition, and modal state handling.

- useVesselGroupDataviewInstance · function · L36-L52 — Returns a callback that constructs a dataview instance for a vessel group by selecting activity datasets and configuring the dataview slug.
- useVesselGroupsOptions · function · L54-L71 — Transforms visible vessel groups into multi-select dropdown options with labels and loading states for UI consumption.
- useVesselGroupsUpdate · function · L73-L92 — Returns a callback that dispatches an async thunk to add vessels to an existing vessel group and returns the updated group or undefined on failure.
- useVesselGroupsModal · function · L94-L112 — Returns a callback that opens a modal for creating or editing a vessel group with selected vessels, validating that vessels exist before proceeding.
