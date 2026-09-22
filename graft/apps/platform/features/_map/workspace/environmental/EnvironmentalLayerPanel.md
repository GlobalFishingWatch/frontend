# apps/platform/features/_map/workspace/environmental/EnvironmentalLayerPanel.tsx · [[deckgl-layer-integration]] [[environmental-layer-management-system]]

Renders a control panel for environmental data visualization layers, enabling users to toggle visibility, manage filters, select color schemes, and view legends for fourwings and context datasets.

- LayerPanelProps · type · L42-L45 — Type definition for the props interface of the EnvironmentalLayerPanel component.
- EnvironmentalLayerPanel · function · L47-L309 — Renders an environmental layer panel with visibility toggle, color/filter controls, dataset fields, and legend for Fourwings datasets.
- changeColor · function · L108-L116 — Updates the dataview with a selected color or color ramp configuration and closes the color picker.
- onToggleColorOpen · function · L117-L119 — Toggles the visibility state of the color picker panel.
- closeExpandedContainer · function · L121-L124 — Closes both the color picker and filter panels.
- onToggleFilterOpen · function · L126-L134 — Toggles the filter panel visibility with a transition callback to defer state updates.
