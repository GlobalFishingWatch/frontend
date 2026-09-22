# apps/track-labeler/src/features/tracks/tracks.thunks.ts · [[redux-state-management-store]] [[vessel-track-data-loading-transformation]]

Provides thunks and utility functions to fetch, validate, and transform vessel track data from API or imported GeoJSON sources.

- fetchTrack · function · L28-L45 — Fetches vessel track data from the Global Fishing Watch API for a given date range and transforms it into track segments.
- trackNeedsFetch · function · L53-L66 — Determines whether a new track fetch is required by checking if track is missing, still loading, or the date range has expanded.
- importedTrackNeedsFetch · function · L68-L73 — Determines whether an imported track needs to be fetched based on whether it is already loaded and not currently loading.
- geojsonToSegments · function · L83-L104 — Converts a GeoJSON feature collection into an array of track segments with coordinate properties extracted from feature geometry and coordinate metadata.
- extractTrackData · function · L106-L120 — Extracts temporal bounds and vessel metadata from a GeoJSON object to determine track start, end, and associated vessel identity.
- trackThunk · function · L127-L199 — Redux thunk that orchestrates track loading by handling both imported GeoJSON and API-fetched tracks, updating Redux state with segments and searchable timestamps.
