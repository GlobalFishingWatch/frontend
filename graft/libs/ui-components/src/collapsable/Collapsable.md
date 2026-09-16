# libs/ui-components/src/collapsable/Collapsable.tsx · [[form-controls-input-components]] [[ui-components-library]]

Provides a collapsible accordion component that renders expandable content sections with toggle callbacks.

- CollapsableProps · interface · L9-L17 — Defines the configuration interface for the Collapsable component including open state, labels, styling, and toggle callbacks.
- Collapsable · function · L19-L40 — Renders an HTML details/summary element with collapsible content, optional label icon, and toggling state management.
- handleToggle · function · L22-L27 — Intercepts toggle events on the details element and invokes the onToggle callback with the new open state.
