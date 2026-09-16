# libs/deck-loaders/src/user/lib/utils.ts · [[coordinate-filtering-with-geometry-conversion]] [[user-tracks-parsing-pipeline]]

Utility module for filtering GeoJSON track features by coordinate properties and temporal values.

- TrackCoordinatesPropertyFilter · type · L11-L17 — Type defining a filter criterion for coordinate-level properties with numeric range or value-list matching.
- FilterTrackByCoordinatePropertiesParams · type · L19-L24 — Type for options passed to the track filtering function controlling filter logic and property inclusion.
- FilterTrackByCoordinatePropertiesArgs · type · L26-L28 — Type alias for the parameter tuple accepted by the coordinate property filtering function.
- FilterTrackByCoordinatePropertiesFn · type · L30-L32 — Function type signature for filtering a feature collection by coordinate properties and returning filtered raw track data.
- LineCoordinateProperties · type · L34-L34 — Type representing coordinate-level properties mapped by property ID for a single LineString.
- MultiLineCoordinateProperties · type · L35-L35 — Type representing coordinate-level properties mapped by property ID for a MultiLineString with per-line arrays.
- CoordinateProperties · type · L36-L36 — Union type for coordinate properties that supports both single and multi-line geometry formats.
- CoordinatesAccumulator · type · L37-L40 — Type for accumulating filtered coordinate segments and their associated property values during filtering.
- GetCoordinatePropertyValueParams · type · L42-L47 — Type for parameters to retrieve a single coordinate property value from line or multi-line coordinate properties.
- getCoordinatePropertyValue · function · L48-L59 — Retrieves a property value at a specific coordinate index, handling both LineString and MultiLineString geometries.
- AddPropertyIndexToCoordinateParams · type · L61-L66 — Type for parameters to add a property value to the accumulated coordinate properties structure.
- addCoordinatePropertyToCoordinate · function · L67-L82 — Appends a coordinate property value to the accumulator, initializing the property structure if needed.
- GetFilteredCoordinatesParams · type · L84-L90 — Type for parameters to filter a coordinate array based on property value criteria.
- getFilteredCoordinates · function · L91-L180 — Filters a coordinate sequence by property criteria while preserving context with leading points and segmentation.
- getFilteredLines · function · L182-L208 — Applies coordinate property filtering to LineString or MultiLineString features, returning non-empty filtered line segments.
- getCoordinatesFilter · function · L210-L233 — Converts raw filter objects into typed coordinate filter criteria, detecting numeric range filters automatically.
- filterTrackByCoordinateProperties · function · L235-L328 — Main export that filters a GeoJSON feature collection by coordinate-level properties and feature-level properties, returning a reduced dataset.
