# libs/timebar/src/charts/highlighter.tsx · [[charts-store-atoms]] [[interactive-tooltip-system]] [[time-representation-conventions]]

React component that renders an interactive tooltip overlay displaying chart data values and metadata at a specific timeline position, with support for fixed positioning and event highlighting.

- getCoords · function · L29-L58 — Calculates pixel coordinates and date label for a time range's center point on the timeline scale.
- findChunks · function · L60-L82 — Filters chart data chunks that intersect a given center time, accounting for minimum highlight duration thresholds.
- findValue · function · L84-L93 — Locates the specific data value within a chunk that corresponds to a given center time.
- HighlighterData · type · L95-L101 — Type definition for tooltip display data including labels, color, icon, and expanded state.
- getHighlighterData · function · L103-L192 — Assembles tooltip content by finding intersecting chart chunks at a time point and extracting their labels, icons, and event IDs.
- TimebarHighlighter · function · L194-L322 — React component that renders an interactive tooltip showing chart data details and a visual highlighter bar at a hovered timeline position.
