# libs/ui-components/src/switch/Switch.tsx · [[aria-accessibility-compliance]] [[css-modules-and-styling-architecture]] [[icon-and-button-ui-elements]] [[switch-control-system]]

Provides a reusable switch component for toggling binary states with optional tooltip, sizing, and custom styling.

- SwitchEvent · interface · L12-L14 — Extends MouseEvent to include an active flag indicating the switch state when clicked.
- SwitchSize · type · L16-L16 — Defines the available size options for the switch component.
- SwitchProps · interface · L18-L29 — Defines the configuration options and callbacks accepted by the Switch component.
- Switch · function · L31-L76 — Renders an accessible toggle button with optional tooltip that invokes a callback with the current active state when clicked.
- onClickCallback · function · L45-L52 — Guards click events to only invoke the provided callback when the switch is not disabled, enriching the event with the current active state.
