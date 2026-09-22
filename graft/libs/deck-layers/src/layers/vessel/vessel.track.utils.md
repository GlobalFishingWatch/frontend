# libs/deck-layers/src/layers/vessel/vessel.track.utils.ts · [[data-transformation-pipeline]] [[spatial-indexing-and-geometry]] [[vessel-layer-system]]

Utility module for filtering and transforming vessel track points by time range into GeoJSON position features.

- sortedFirstIndexAfter · function · L7-L19 — Binary search to find the first track point with timestamp strictly after the given time.
- sortedFirstIndexAtOrAfter · function · L21-L33 — Binary search to find the first track point with timestamp at or after the given time.
- getPositions · function · L35-L61 — Converts a filtered slice of track points within a time range into GeoJSON features with position and metadata.
