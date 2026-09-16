# apps/platform/features/_map/workspace/activity/ActivityLayerPanel.tsx · [[activity-dataview-management-system]] [[deckgl-layer-integration]] [[workspace-redux-state]]

Component module providing an interactive panel for configuring and displaying activity layer properties in the map workspace.

- LayerPanelProps · type · L57-L62 — Type definition specifying the configuration props for the activity layer panel component.
- ActivityLayerPanel · function · L64-L421 — React component that renders an interactive panel for managing activity layer visibility, filtering, color properties, and deprecation warnings.
- disableBivariate · function · L115-L117 — Clears the bivariate dataview configuration from query parameters.
- onSplitLayers · function · L119-L134 — Handles splitting bivariate layer visualization by tracking the event and disabling bivariate mode.
- onLayerSwitchToggle · function · L136-L141 — Toggles layer visibility and disables bivariate mode when the layer switch is activated.
- onRemoveLayerClick · function · L143-L148 — Removes a dataview layer from the map, cleaning up bivariate state if the removed layer was part of it.
- onToggleFilterOpen · function · L150-L155 — Toggles the filter panel open state and dismisses the filter hint notification.
- changeColor · function · L157-L166 — Updates the layer's color and color ramp configuration based on user selection.
- onToggleColorOpen · function · L168-L170 — Toggles the color picker panel visibility state.
- closeExpandedContainer · function · L172-L175 — Closes both the filter and color picker expanded panels.
