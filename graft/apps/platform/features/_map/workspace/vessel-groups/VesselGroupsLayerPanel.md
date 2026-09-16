# apps/platform/features/_map/workspace/vessel-groups/VesselGroupsLayerPanel.tsx · [[layer-property-customization]] [[vessel-groups-management]]

React component that renders a collapsible layer panel for vessel groups on the map, providing controls to show/hide, edit, fit bounds, adjust color properties, and migrate deprecated vessel group datasets.

- VesselGroupLayerPanelProps · type · L48-L51 — Defines the props interface for the VesselGroupLayerPanel component.
- VesselGroupLayerPanel · function · L53-L313 — Renders an interactive layer panel for a vessel group, managing its visibility, color customization, edit mode, bounds navigation, and migration warnings.
- changeInstanceColor · function · L103-L112 — Updates the dataview instance with new color and color ramp settings.
- onEditClick · function · L114-L123 — Opens the vessel group edit modal and sets the confirmation mode to update if the group is outdated.
- onToggleColorOpen · function · L125-L127 — Toggles the color picker panel open or closed.
- closeExpandedContainer · function · L129-L131 — Closes the expanded color picker container.
- onUpdateDeprecatedLayerClick · function · L133-L135 — Migrates the vessel group to the latest version when the deprecated warning button is clicked.
