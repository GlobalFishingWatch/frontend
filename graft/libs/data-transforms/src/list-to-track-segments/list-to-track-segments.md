# libs/data-transforms/src/list-to-track-segments/list-to-track-segments.ts · [[track-segment-processing-pipeline]]

Module that converts a list of records with coordinate and temporal properties into grouped track segments for visualization.

- Args · type · L11-L14 — Type that specifies the required input parameters for converting records into track segments.
- sortRecordsByTimestamp · function · L18-L30 — Sorts an array of records chronologically by their timestamp property using UTC date parsing.
- splitSegmentAtAntimeridian · function · L32-L46 — Breaks a track segment into multiple segments when the antimeridian (180° longitude) is crossed.
- listToTrackSegments · function · L48-L111 — Transforms raw records into organized track segments grouped by line and segment IDs, with coordinate validation and antimeridian splitting.
