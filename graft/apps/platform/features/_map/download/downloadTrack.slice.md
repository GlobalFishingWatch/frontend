# apps/platform/features/_map/download/downloadTrack.slice.ts · [[download-state-workflow-orchestration]] [[track-download-format-conversion]]

- VesselParams · type · L17-L21 — Data structure representing vessel identification and dataset parameters for download operations.
- DownloadTrackState · interface · L23-L30 — Redux state shape tracking vessel download request status, error conditions, and API rate limit information.
- DownloadTrackParams · type · L41-L48 — Parameters required to initiate a track download request including vessel selection, date range, format, and optional data thinning configuration.
- parseRateLimit · function · L50-L57 — Extracts rate limit and retry information from HTTP response headers into a structured object.
- RejectValueType · type · L59-L59 — Shape of rejected async thunk payload containing parsed API error and optional rate limit metadata.
- LazyLoadedSlices · interface · L182-L182 — Module augmentation interface registering the downloadTrack slice with the root reducer for lazy loading.
