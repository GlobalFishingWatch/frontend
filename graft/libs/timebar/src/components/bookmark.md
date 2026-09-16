# libs/timebar/src/components/bookmark.tsx · [[bookmark-persistence-pattern]] [[time-representation-conventions]]

React component that renders an interactive bookmark element on a timeline with overflow handling and date range display.

- BookmarkProps · type · L16-L27 — Props type that defines the configuration for a bookmark component including time scale, position bounds, callbacks, and localization.
- Bookmark · function · L29-L99 — Component that renders a draggable bookmark on a timeline, calculating its display position and width while handling overflow cases when the bookmark extends beyond viewport bounds.
