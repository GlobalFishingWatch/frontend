# apps/track-labeler/src/features/sidebar/Sidebar.tsx · [[sidebar-segment-labeling-interface]]

Main sidebar component for the track labeler application that displays vessel information, segment management UI, and provides import/export/save functionality with keyboard shortcuts.

- formatedDate · function · L43-L49 — Formats a timestamp in milliseconds to a human-readable UTC datetime string.
- SegmentRowItemProps · type · L51-L59 — Type definition for the props passed to a segment row renderer, specifying segment data and interaction callbacks.
- SegmentRowItem · function · L61-L127 — Renders a single track segment row with timestamps, action dropdown, and delete button, emitting highlight events on hover.
- Sidebar · function · L129-L405 — Main sidebar component displaying vessel metadata, segment list, and action buttons while enforcing project and application access control.
