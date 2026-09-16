# libs/data-transforms/src/filter-tracks-coordinates/index.ts · [[track-segment-processing-pipeline]]

Module that filters GeoJSON track features by coordinate-level properties using min/max ranges or discrete value lists.

- TrackCoordinatesPropertyFilter · type · L23-L28 — Type defining a single filter criterion on coordinate properties with optional numeric range or discrete value matching.
- FilterTrackByCoordinatePropertiesParams · type · L30-L34 — Type defining the parameters for filtering a track including filter list and optional feature inclusion flags.
- FilterTrackByCoordinatePropertiesArgs · type · L36-L38 — Type alias for the tuple of arguments passed to the main filter function.
- FilterTrackByCoordinatePropertiesFn · type · L40-L42 — Type for a function that filters GeoJSON features by coordinate properties and returns a filtered feature collection.
- LineCoordinateProperties · type · L44-L44 — Type representing properties attached to coordinates in a LineString geometry.
- MultiLineCoordinateProperties · type · L45-L45 — Type representing properties attached to coordinates in a MultiLineString geometry.
- CoordinateProperties · type · L46-L46 — Union type representing coordinate properties for either LineString or MultiLineString geometries.
- CoordinatesAccumulator · type · L47-L50 — Type for accumulating filtered coordinates and their associated properties during reduction.
- GetCoordinatePropertyValueParams · type · L52-L57 — Type defining parameters for retrieving a property value attached to a specific coordinate.
- getCoordinatePropertyValue · function · L58-L69 — Retrieves a property value for a coordinate, handling both single LineString and MultiLineString index cases.
- AddPropertyIndexToCoordinateParams · type · L71-L76 — Type defining parameters for adding a property value to a coordinate in the accumulator.
- addCoordinatePropertyToCoordinate · function · L77-L92 — Adds a property value to a coordinate entry in the accumulator, initializing arrays as needed.
- GetFilteredCoordinatesParams · type · L94-L99 — Type defining parameters for filtering coordinates by property filter criteria.
- getFilteredCoordinates · function · L100-L179 — Filters a coordinate sequence by checking each coordinate against property filters and maintains continuity by including a preceding point when a gap occurs.
- getFilteredLines · function · L181-L204 — Applies coordinate filtering to all lines in a feature, handling both LineString and MultiLineString geometry types.
- FilteredTrackData · type · L206-L206 — Type alias for a FeatureCollection containing filtered LineString or MultiLineString features.
- filterTrackByCoordinateProperties · function · L207-L269 — Main export that filters a GeoJSON feature collection to include only coordinates matching the supplied property filters, optionally preserving non-matching features.
- filterByTimerangeMemoizeEqualityCheck · function · L271-L280 — Compares two sets of function arguments for memoization, checking feature count and filter equality.
- getTrackFilters · function · L282-L296 — Converts a record of filter values into structured filter objects, inferring min/max ranges for numeric pairs.
- getTimeFilter · function · L298-L309 — Creates a time-range filter by parsing ISO date strings into millisecond timestamps.
