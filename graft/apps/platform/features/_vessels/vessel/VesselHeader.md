# apps/platform/features/_vessels/vessel/VesselHeader.tsx · [[vessel-layout-and-visualization]] [[vessel-profile-core]]

React component module that renders the vessel profile header with vessel image gallery, ship information, and action buttons for map centering, printing, and vessel group management.

- VesselHeader · function · L47-L278 — Main React component that displays the vessel header section with image slider, vessel name, and action controls (download, fit bounds, print, add to group).
- onAddToVesselGroup · function · L78-L85 — Callback that tracks analytics events when a vessel is added to a vessel group.
- enableVesselPrintMode · function · L88-L91 — Callback that enables print mode by dispatching state change and closing the side panel.
- disableVesselPrintMode · function · L92-L94 — Callback that disables print mode by dispatching state change after printing completes.
- onVesselFitBoundsClick · function · L125-L129 — Callback that centers the map on the vessel bounds and tracks the user action.
- onPrintClick · function · L131-L135 — Callback that enables print mode, closes the side panel, and tracks the print action.
- handleMouseMove · function · L137-L142 — Event handler that calculates the mouse position relative to the image container to enable zoom effect at cursor location.
