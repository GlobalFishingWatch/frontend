# apps/track-labeler/src/features/tracks/tracks.selectors.ts · [[red-black-tree-index-for-efficient-segment-lookups]] [[vessel-track-data-loading-transformation]]

Export file containing Redux selectors for vessel track data filtering, parsing, and geometric bounds calculation.

- PointEvent · type · L95-L95 — Type alias representing a partial track point event with optional numeric field values used for filtering.
- getCurrentVesselAction · function · L185-L205 — Determines the action label for a track point by querying a b-tree of user-selected time ranges to find matching segments.
- getNodeAction · function · L191-L199 — Checks if a b-tree node's time interval contains the given timestamp and returns its associated action.
