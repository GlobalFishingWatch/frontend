# apps/platform/features/debug/debug.slice.ts · [[debug-tools]]

Redux slice managing debug menu state, feature flags, and debug options for the platform.

- FeatureFlag · enum · L6-L8 — Enumeration of feature flags available for controlled feature rollout.
- DebugOption · enum · L10-L19 — Enumeration of debug options that can be toggled to enable diagnostic visualizations and behaviors.
- DebugOptions · type · L23-L23 — Type alias mapping each debug option to its boolean enabled/disabled state.
- DebugState · interface · L25-L29 — Interface defining the shape of the debug state with active flag, feature flags, and debug options.
- selectDebugActive · function · L72-L72 — Selector that retrieves the active status of the debug menu from Redux state.
- selectDebugOptions · function · L73-L73 — Selector that retrieves all debug options and their current enabled/disabled states from Redux state.
- selectFeatureFlags · function · L74-L74 — Selector that retrieves all feature flags and their current enabled/disabled states from Redux state.
