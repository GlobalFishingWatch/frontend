# libs/react-hooks/src/use-event-listener/use-event-key-listener.ts · [[react-hooks-defensive-patterns]] [[react-hooks-library]]

Custom React hook that attaches a keyboard event listener to a DOM node and triggers a callback when specified keys are pressed within that node.

- useEventKeyListener · function · L3-L18 — A React hook that creates a ref to an HTML element and registers a global keydown listener that fires a callback only when target keys are pressed within that element.
- eventHandler · function · L7-L12 — Validates that a keyboard event occurred within the parent element and that the pressed key matches one of the watched keys before invoking the callback.
