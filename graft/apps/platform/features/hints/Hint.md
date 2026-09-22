# apps/platform/features/hints/Hint.tsx · [[hints-contextual-help]]

Renders a dismissible help hint bubble that displays contextual guidance information in a popover with options to hide individual or all hints.

- HintProps · type · L25-L28 — Type definition for the Hint component's props, specifying the hint's unique identifier and optional styling class.
- Hint · function · L30-L149 — React component that renders a dismissible help hint popover with configurable placement, images, and user guide links, respecting read-only and screenshot modes.
- onOpenChange · function · L70-L77 — Handler that tracks hint popover open/close events and updates the hint's visibility state.
