# libs/timebar/src/timeline/use-pointer-interaction.ts · [[d3-scale-date-transformation-pattern]] [[drag-state-event-sourcing-pattern]] [[pointer-event-gesture-recognition-pattern]] [[refs-based-closure-management]] [[timebar-timeline-interaction-system]]

React hook that manages pointer (mouse and touch) interactions for timeline dragging and zooming operations.

- Params · type · L30-L42 — Configuration object type that bundles timeline state refs, handlers, and hover reporting callbacks required by the pointer interaction hook.
- usePointerInteraction · function · L44-L218 — React hook that sets up global event listeners for mouse and touch interactions to enable dragging the timeline range and zooming by dragging handlers.
- onMouseMoveWindow · function · L72-L139 — Handles mousemove and touchmove events to detect dragging and zoom operations, reporting hover position and updating timeline state accordingly.
- onMouseUpWindow · function · L141-L189 — Processes mouseup and touchend events to finalize drag and zoom operations, computing new range bounds and notifying observers of the completed interaction.
- onInteractionCancel · function · L193-L198 — Resets dragging state when a pointer gesture is cancelled to ensure clean state after aborted interactions like touchcancel.
