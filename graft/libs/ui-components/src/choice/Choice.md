# libs/ui-components/src/choice/Choice.tsx · [[form-controls-input-components]] [[responsive-overflow-detection-pattern]] [[ui-components-library]]

A responsive button group component that switches between an inline radio-button-style pill UI and a dropdown select when space is constrained.

- ChoiceOption · type · L13-L13 — Type alias for a choice option based on the underlying SelectOption type.
- ChoiceProps · interface · L15-L26 — Props interface defining the configuration for the Choice component including options, selection state, and display customizations.
- Choice · function · L28-L176 — Main Choice component that renders selectable options with an animated pill indicator and overflow detection to switch to a dropdown when space is constrained.
- onOptionClickHandle · function · L81-L86 — Handles option click events, updating the active ref and triggering the selection callback if the clicked option is not already active.
