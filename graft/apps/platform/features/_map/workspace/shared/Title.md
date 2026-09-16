# apps/platform/features/_map/workspace/shared/Title.tsx · [[layer-visibility-toggling]]

React component module for rendering a clickable title element that toggles dataview layer visibility on the map.

- TitleProps · type · L15-L24 — Configuration type for the Title component defining dataview instance, styling, content, and visibility toggle options.
- Title · function · L26-L76 — React functional component that renders a toggleable title with optional icon and tooltip, managing layer visibility state through dataview instance updates.
- onToggleLayerActive · function · L42-L55 — Handler that updates the dataview visibility state and fires a refresh event when the title is clicked, with optional callback delegation.
