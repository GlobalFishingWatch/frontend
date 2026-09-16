# libs/timebar/src/timeline/use-timeline-layout.ts · [[refs-based-closure-management]] [[timebar-timeline-interaction-system]]

Module that exports a React hook for managing timeline layout state and synchronizing it with DOM mutations and resize events.

- Params · type · L7-L11 — Type defining the required parameters for the useTimelineLayout hook: node reference, graph container reference, and state setter callback.
- useTimelineLayout · function · L13-L60 — React hook that measures the timeline graph container dimensions and observes resize events to update layout state with calculated pixel positions and offsets.
- onWindowResize · function · L15-L37 — Handler that queries the graph container's computed dimensions and bounding position, then updates state with calculated layout metrics including inner/outer widths and relative offsets.
