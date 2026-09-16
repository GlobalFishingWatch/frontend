# libs/timebar/src/timeline/timeline-drag.utils.ts · [[time-snapping-boundary-logic]] [[timeline-drag-handler]]

Utility module providing drag-and-zoom interaction handlers for a timeline component with pinning, boundary resolution, and state management.

- Dragging · type · L18-L18 — Union type for the three drag modes: zooming in at start, zooming in at end, or seeking/panning the inner range.
- ZoomState · type · L25-L29 — Holds the current drag mode and pixel positions of the zoom range's inner boundaries.
- getIsHandlerZoomingIn · function · L31-L46 — Determines whether a drag motion is a valid zoom-in, applying minimum gap constraints and computing the clamped position.
- getIsHandlerZoomingOut · function · L48-L53 — Checks if a drag motion is moving outward beyond the inner range boundaries to trigger zoom-out.
- StickDir · type · L55-L55 — Directionality option for snapping dates to unit boundaries: nearest, floor, or ceiling.
- stickBoundary · function · L57-L61 — Aligns a date to a unit boundary (start, end, or nearest) using Luxon DateTime operations.
- resolveStickRange · function · L63-L82 — Snaps a dragged range's start and end dates to calendar unit boundaries, maintaining minimum duration.
- resolveDragSource · function · L84-L88 — Maps drag state (zoom-in, seek, zoom-out) to an event source constant for tracking user interaction type.
- TimelineState · type · L90-L102 — State object tracking all dimensions, positions, and drag mode for the timeline widget.
- TimelineLatestProps · type · L118-L125 — Props container for timeline drag handlers holding date range, callbacks, and configuration options.
- TimeScaleRef · type · L127-L127 — React ref type for a D3 time scale used to convert date values to pixel coordinates.
- TimelineStateRef · type · L128-L128 — React ref type for accessing the current timeline state across render cycles.
- TimelineLatestPropsRef · type · L129-L129 — React ref type for storing latest timeline props without triggering re-renders.
- RangeRef · type · L130-L130 — Alias to the timebar context's range ref type for tracking the active date range.
- SetTimelineState · type · L131-L131 — Function type for applying partial state updates to the timeline state object.
