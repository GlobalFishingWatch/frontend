# apps/track-labeler/src/features/timebar/timebar.hooks.ts · [[segment-labeling-track-annotation]] [[timebar-ui-data-filtering]] [[two-click-interaction-pattern-for-segment-creation]] [[url-query-parameter-state-synchronization]]

Custom React hooks module for timebar functionality including time range selection, display mode switching, and segment labeling.

- useTimerangeConnect · function · L24-L94 — Hook that connects Redux dispatch to timerange and filter parameter updates for date, hours, elevation, distance, and speed controls.
- useTimebarModeConnect · function · L96-L114 — Hook that provides selectors and dispatchers for timebarMode, filterMode, and colorMode query parameter synchronization.
- dispatchTimebarMode · function · L101-L102 — Dispatcher that updates the timebarMode query parameter in Redux store.
- dispatchFilterMode · function · L103-L104 — Dispatcher that updates the filterMode query parameter in Redux store.
- dispatchColorMode · function · L105-L105 — Dispatcher that updates the colorMode query parameter in Redux store.
- useSegmentsLabeledConnect · function · L116-L294 — Hook that manages segment labeling state and user interactions for creating and handling overlapping vessel track segments.
- createNewSegment · function · L128-L166 — Creates a SelectedTrackType segment from two click points, normalizing timestamps to ensure start comes before end.
- handleSegmentOverlap · function · L168-L244 — Resolves conflicts between existing segments and a new segment by splitting or removing segments based on overlap patterns.
- onEventPointClick · function · L246-L287 — Handles user clicks on timeline events to initiate or complete segment creation, managing the two-click interaction pattern.
