# apps/track-labeler/src/features/tracks/tracks.utils.ts · [[antimeridian-crossing-workaround]] [[segment-labeling-track-annotation]] [[vessel-track-data-loading-transformation]]

Utility module providing functions to extract labeled track segments and fix antimeridian coordinate wrapping issues.

- extractLabeledTrack · function · L4-L76 — Parses labeled track features from GeoJSON and segments them by action label, returning ordered segments with overall time bounds.
- fixCoordinates · function · L78-L108 — Adjusts longitude coordinates across the antimeridian to prevent map rendering discontinuities when features cross the 180° meridian.
