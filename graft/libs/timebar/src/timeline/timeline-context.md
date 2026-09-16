# libs/timebar/src/timeline/timeline-context.ts · [[timeline-context-system]]

Exports timeline context utilities and type definitions for managing d3 time scales, locale settings, and mouse event handlers in the timebar component.

- TimelineScale · type · L6-L6 — Type alias for a d3 time scale that maps temporal values to numeric pixel coordinates.
- TrackGraphOrientation · type · L8-L8 — Type that specifies the vertical direction and layout mode for graph tracks within the timeline.
- TimebarLocale · type · L11-L11 — Type that enumerates supported UI language locales for the timebar component.
- TimebarMouseLeaveHandler · type · L13-L13 — Type for a callback function invoked when the mouse leaves the timebar interaction area.
- TimebarMouseMoveHandler · type · L14-L18 — Type for a callback function invoked on mouse movement that receives normalized coordinates, a scale function, and an optional day-mode flag.
- ISODateString · type · L21-L21 — Type alias for ISO 8601 date-time strings used to represent temporal boundaries.
- StickUnit · type · L24-L24 — Type that restricts snappable time units to hour, day, month, and year granularities for range alignment.
- TimelineContextProps · type · L26-L34 — Type that defines the shape of state held by the timeline context, including scale, dimensions, and rendering orientation.
