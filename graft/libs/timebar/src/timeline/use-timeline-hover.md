# libs/timebar/src/timeline/use-timeline-hover.ts · [[timebar-timeline-interaction-system]]

Custom React hook that manages timeline hover interactions by throttling mouse move events and handling mouse leave events to show/hide tooltips.

- Params · type · L11-L15 — Defines the configuration object parameter structure for the useTimelineHover hook.
- MoveScale · type · L17-L17 — Represents a function type that converts a numeric value to a Date for timeline scaling.
- ThrottledEmit · type · L19-L22 — Defines a throttled callback function that emits hover events with optional cancellation.
- useTimelineHover · function · L24-L51 — Creates a throttled hover event handler and state management interface for timeline mouse interactions.
- report · method · L39-L41 — Emits a throttled mouse move event with cursor position, scale function, and day flag.
- leave · method · L42-L47 — Clears hover state and emits a null event to dismiss the tooltip when mouse leaves the timeline.
