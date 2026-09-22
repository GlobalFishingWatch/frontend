# apps/platform/features/_map/workspace/shared/ExpandedContainer.tsx · [[layer-panel-container-and-layout-components]]

React component module that exports a floating UI container for displaying expanded content with arrow positioning and boundary-aware overflow handling.

- ExpandedContainerProps · interface · L25-L36 — Defines configuration props for the ExpandedContainer component, including visibility, content, callbacks, and positioning behavior.
- ExpandedContainer · function · L38-L139 — Renders a floating container that positions expanded content with automatic boundary detection, overflow prevention, and arrow alignment.
- fn · method · L55-L70 — Custom floating-ui middleware that shifts the floating element horizontally when it overflows the designated boundary container.
- apply · method · L96-L102 — Adjusts the floating element's width to match its reference element's width for proper content alignment.
