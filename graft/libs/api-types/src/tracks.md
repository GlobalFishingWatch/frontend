# libs/api-types/src/tracks.ts · [[api-types-type-definitions]] [[geospatial-filtering-region-hierarchies]]

- TrackField · enum · L3-L17 — Enumerates the standard field names available for track point data including position, temporal, and vessel-specific measurements.
- TrackPointProperties · type · L19-L19 — Defines a flexible property object type that can hold any additional attributes on track points.
- GeojsonTrackProperties · type · L20-L23 — Structures optional properties and coordinate-specific properties for GeoJSON-compatible track representation.
- TrackPoint · type · L24-L24 — Combines optional tracked field values with GeoJSON properties to represent a single point in a track.
- TrackSegment · type · L26-L26 — Represents a contiguous sequence of track points.
- TrackResourceData · type · L28-L28 — Represents the complete track data as an array of track segments.
- UserTrack · type · L30-L30 — Defines a GeoJSON FeatureCollection of LineStrings with track properties for geographic visualization.
