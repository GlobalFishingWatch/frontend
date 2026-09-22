# apps/platform/features/_map/workspace/vessels/VesselLayerPanel.tsx · [[dataview-composition-and-resolution]] [[layer-property-customization]] [[vessel-tracking-and-metadata]]

Renders a collapsible layer panel for a single vessel, displaying vessel identity, tracks, filters, and download/configuration controls within the map workspace.

- VesselLayerPanelProps · type · L59-L63 — Props interface specifying dataview instance, optional apply-to-all toggle, and optional data sources display for the vessel layer panel.
- VesselLayerPanel · function · L65-L377 — Main component that renders a configurable panel for vessel layer management with color, filter, and download controls.
- changeTrackColor · function · L91-L99 — Updates the vessel dataview instance with a new track color selection and closes the color picker.
- onToggleColorOpen · function · L101-L103 — Toggles the visibility state of the color picker expanded container.
- onToggleFilterOpen · function · L105-L107 — Toggles the visibility state of the filter panel expanded container.
- closeExpandedContainer · function · L109-L113 — Closes all expanded containers (color picker, filters, and info panel) simultaneously.
- getVesselTitle · function · L150-L174 — Generates the vessel display title with appropriate vessel identity indicators, names, and access level icons based on data availability and permissions.
