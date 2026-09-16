# apps/platform/features/_map/workspace/activity/TurningTidesFilters.tsx · [[activity-dataview-filtering]]

React component that provides a multi-select filter interface for Turning Tides vessel activity data.

- LayerFiltersProps · type · L19-L22 — Type definition specifying the props for the TurningTidesFilters component with dataview instance and optional confirmation callback.
- TurningTidesFilters · function · L24-L98 — React component that renders a multi-select interface to filter and confirm vessel selections for Turning Tides activity data.
- onConfirmFilters · function · L42-L57 — Persists the selected vessels and their related vessel IDs to the dataview instance configuration when the confirm action is triggered.
- onSelectVesselsClick · function · L59-L61 — Adds a selected vessel to the local vessels selection state.
- onRemoveVesselsClick · function · L63-L65 — Removes a deselected vessel from the local vessels selection state.
- onCleanClick · function · L67-L69 — Clears all selected vessels from the local selection state.
