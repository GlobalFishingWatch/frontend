# libs/timebar/src/charts/tracks-events.tsx · [[chart-rendering-engine]] [[charts-store-atoms]]

- toDeckColor · function · L40-L43 — Converts a hex color string to a deck.gl RGBA color array, defaulting to white for missing or 'white' values.
- EventDatum · type · L45-L55 — Data structure holding event geometry and metadata for rendering individual fishing, gap, port, loitering, and encounter events on the timeline.
- LineDatum · type · L57-L57 — Data structure for a simple line segment with a path and color.
- getTracksEventsWithCoords · function · L59-L80 — Transforms track events with relative time and size coordinates based on the timeline origin and graph dimensions.
- getTracksWithCoords · function · L82-L104 — Transforms track data with computed x, y, and width coordinates for rendering on the timeline.
- TimebarTracksEvents · function · L106-L457 — React component that renders interactive deck.gl layers for track segments and event geometries (fishing, gaps, ports, loitering, encounters) with highlighting, hover, and click callbacks.
- toMs · function · L185-L185 — Converts pixel distance to milliseconds at the current zoom level.
- hit · function · L333-L334 — Checks whether an event datum is highlighted by matching its ID or cluster IDs against the highlighted set.
