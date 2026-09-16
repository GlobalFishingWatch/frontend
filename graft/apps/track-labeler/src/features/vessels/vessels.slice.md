# apps/track-labeler/src/features/vessels/vessels.slice.ts · [[track-labeler-vessel-metadata]]

Redux slice that manages vessel tracking data including vessel info, track geometry, events, and imported vessel export data.

- Dictionary · interface · L10-L12 — Generic key-value container for mapping string keys to values of any type.
- VesselDynamicField · type · L14-L18 — Represents a time-windowed vessel property with start and end dates and a value.
- Vessel · type · L20-L28 — Core vessel entity with identification, name, and optional dynamic flag and MMSI history.
- CoordinateProperties · type · L29-L35 — GeoJSON feature metadata that associates coordinate timestamps with positional data.
- TrackGeometry · type · L37-L37 — GeoJSON FeatureCollection wrapper for geographic track data with coordinate time metadata.
- TrackInterface · type · L39-L44 — Container for a complete vessel track with segments, date range, and unique identifier.
- TrackItem · interface · L45-L51 — Redux state wrapper for a track that includes loading status, error handling, and date boundaries.
- VesselInfo · interface · L53-L60 — Vessel metadata including identity, name, callsign, flag, MMSI, and IMO for display and lookup.
- Tracks · interface · L62-L64 — Dictionary mapping vessel IDs to their current track loading and data state.
- VesselsSlice · type · L66-L73 — Complete Redux state tree for vessel labeling including vessels, tracks, events, timestamps, and imported data.
- selectVessels · function · L153-L153 — Redux selector that retrieves the vessel info dictionary from state.
- selectTracks · function · L154-L154 — Redux selector that retrieves the current vessel tracks from state.
- selectOriginalTracks · function · L155-L155 — Redux selector that retrieves the original unmodified vessel tracks from state.
- selectEvents · function · L156-L156 — Redux selector that retrieves the vessel events dictionary from state.
- selectImportedData · function · L157-L157 — Redux selector that retrieves the currently imported vessel export data from state.
- selectTimestamps · function · L158-L158 — Redux selector that retrieves the searchable track timestamps from state.
