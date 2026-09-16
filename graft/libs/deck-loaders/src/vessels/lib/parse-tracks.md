# libs/deck-loaders/src/vessels/lib/parse-tracks.ts · [[attribute-clamping-and-safe-defaults]] [[relative-vs-absolute-timestamp-conversion]] [[vessel-tracks-parsing-pipeline]]

- getExtent · function · L11-L45 — Computes the min/max extent of numeric track attributes (speed or elevation) with inverted logic for negative depth values.
- getVesselGraphExtentClamped · function · L47-L61 — Clamps a domain's min/max extent to predefined limits, handling NaN values and inverting logic for elevation data.
- VesselTrackLoaderParams · type · L63-L70 — Configuration options for controlling track parsing behavior including optional gap computation and timestamp rebasing.
- toAbsoluteTimestamp · function · L72-L74 — Converts a relative timestamp to absolute time by adding the base epoch offset.
- toRelativeTimestamp · function · L76-L78 — Converts an absolute timestamp to relative time by subtracting the base epoch offset.
- parseTrack · function · L80-L162 — Decodes protobuf vessel track data and assembles typed arrays for path, timestamps, speed, elevation with optional computed time gaps between points.
