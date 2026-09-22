# apps/platform/features/_map/workspace/shared/VisualisationChoice.tsx · [[visualization-mode-selection]]

Renders a radio-button-styled choice component allowing users to select between multiple visualization options with support for disabled and collapsable states.

- VisualisationChoiceProps · interface · L9-L15 — Defines the prop interface for VisualisationChoice, specifying the options to display, active selection state, selection callback, and styling customization.
- VisualisationChoice · function · L17-L72 — Renders a radio-group-like button selection component that allows users to choose from multiple visualization options while enforcing collapsable logic between positions and heatmap modes.
- onOptionClickHandle · function · L24-L28 — Delegates option click events to the parent-provided onSelect callback when defined.
