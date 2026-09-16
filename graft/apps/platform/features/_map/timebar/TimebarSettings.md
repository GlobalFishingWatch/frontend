# apps/platform/features/_map/timebar/TimebarSettings.tsx · [[timebar-settings-component]] [[workspace-redux-state]]

Provides a settings panel UI for selecting which data visualization (activity, detections, events, vessel tracks, environmental data, user points) to display in the timebar with icon toggles and analytics tracking.

- Icon · function · L43-L67 — Pure UI component that renders an SVG icon with an optional label and disabled state styling.
- TimebarSettings · function · L69-L384 — Main component that manages timebar visualization settings panel with multiple data visualization options (activity, detections, tracks, graphs, environmental data).
- openOptions · function · L92-L99 — Opens the timebar settings options panel and logs an analytics event for visualization tracking.
- closeOptions · function · L100-L102 — Closes the timebar settings options panel.
- setTimebarSectionActive · function · L104-L111 — Activates a timebar visualization section and logs the selection as an analytics event.
- setEnvironmentActive · function · L113-L121 — Switches timebar to environment visualization mode for a specific environmental dataview and tracks the selection.
- setUserPointsActive · function · L122-L130 — Switches timebar to points visualization mode for a specific user points dataview and tracks the selection.
- setVesselGroupActive · function · L132-L140 — Switches timebar to vessel group visualization mode for a specific vessel group dataview and tracks the selection.
- setVesselActive · function · L141-L149 — Switches timebar to vessel track visualization with no graph overlay and disables any active graph mode.
- setVesselGraph · function · L151-L159 — Switches timebar to vessel track visualization with an overlay graph (speed or depth) and tracks the selection.
- getVesselGraphTooltip · function · L161-L179 — Generates context-aware tooltip text for vessel graph options based on data availability and layer configuration.
