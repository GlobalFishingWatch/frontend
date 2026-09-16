# libs/ui-components/src/button/Button.tsx · [[button-interactive-controls]] [[ui-components-library]]

A reusable Button component library that supports multiple visual styles, sizes, states, and optional tooltip and icon rendering.

- ButtonType · type · L11-L11 — Enumeration of supported button visual style variants.
- ButtonSize · type · L12-L12 — Enumeration of supported button size options.
- HTMLButtonType · type · L13-L13 — Type constraint for the underlying HTML button element's type attribute.
- ButtonProps · interface · L15-L38 — Configuration interface for the Button component, supporting styling, interaction callbacks, links, loading states, and optional tooltip behavior.
- ChildProps · type · L40-L40 — Interface for extracting className and children props from a child element when using asChild mode.
- renderAsChild · function · L42-L59 — Helper that clones a child element with button styles and ARIA attributes for router link integration without router dependency.
- Button · function · L61-L126 — Main Button component that renders as a link, asChild proxy, or native button element depending on props, with loading and disabled states.
- renderContent · function · L89-L94 — Conditional renderer that displays either a loading spinner or icon alongside button content.
