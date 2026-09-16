# libs/deck-layers/src/layers/fourwings/positions/fourwings-positions.utils.ts · [[fourwings-positions-layer]] [[vessel-track-reconstruction]]

Utility module providing position-processing functions for Fourwings vessel tracking, including vessel name cleaning, track building, and viewport filtering.

- upperFirst · function · L8-L10 — Capitalizes the first character of a string and lowercases the remainder.
- cleanVesselShipname · function · L12-L17 — Normalizes vessel ship names by applying title-case formatting to capitalized words while preserving Roman numerals.
- getIsActivityPositionMatched · function · L19-L24 — Determines whether an activity position feature has identifying information by checking for non-empty shipname or id properties.
- getIsDetectionsPositionMatched · function · L26-L31 — Determines whether a detection position feature has identifying information by checking for non-empty shipname or vessel_id properties.
- getPositionBearing · function · L33-L35 — Extracts the bearing direction from a position feature, falling back to course if bearing is unavailable.
- getIsIdInFilterIds · function · L39-L47 — Checks whether a given id exists in a filter set, caching filter arrays as Sets for performance optimization.
- getIsFeatureInFilterIds · function · L49-L51 — Determines whether a position feature passes an id filter by extracting its id and delegating to getIsIdInFilterIds.
- FourwingsPositionsVesselTrack · type · L53-L58 — Data type representing a single continuous vessel track segment with id, layer, and flattened lon-lat coordinate array for rendering.
- getTrackPath · function · L60-L78 — Converts a subset of position features into a flattened Float64Array of coordinates, adjusting longitude discontinuities at antimeridian.
- getVesselTracks · function · L80-L127 — Aggregates position features into continuous vessel track segments, splitting on time gaps exceeding a threshold and returning the last position per vessel.
- filteredPositionsByViewport · function · L129-L142 — Filters position features to only those within the geographic bounds of a map viewport.
