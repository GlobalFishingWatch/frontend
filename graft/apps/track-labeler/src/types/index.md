# apps/track-labeler/src/types/index.ts · [[activity-type-ontology]] [[query-driven-state-synchronization]]

Type definitions module for track labeling workspace configuration, vessel tracking data, action categorization, and data export structures.

- WorkspaceParam · type · L3-L26 — Union type that enumerates all valid workspace parameter names for track labeler configuration and state management.
- QueryParams · type · L27-L29 — Object type that allows optional query parameters of various types for workspace configuration.
- CoordinatePosition · type · L31-L34 — Basic geographical coordinate structure representing latitude and longitude.
- MapCoordinates · type · L36-L41 — Extended geographical coordinate structure that includes zoom level and optional transition animation duration.
- VesselPoint · type · L43-L60 — Data structure representing a single tracked point on a vessel's trajectory with position, movement, and labeling metadata.
- ActionType · enum · L62-L82 — Enumeration of all possible activity labels that can be assigned to vessel track segments.
- TrackColor · type · L84-L86 — Mapping from action types to hex color codes for visual track rendering.
- LayersData · type · L118-L121 — Container for track points grouped by their assigned action type.
- DayNightLayer · type · L123-L127 — Structure defining a time period marked as day or night for temporal visualization.
- ArrowFeature · type · L129-L141 — GeoJSON feature representing a directional arrow showing vessel movement direction and speed.
- VesselDirectionsGeneratorConfig · interface · L143-L149 — Configuration object for rendering vessel direction arrows as GeoJSON features on the map.
- ExportFeature · type · L151-L167 — GeoJSON Feature with LineString geometry and labeled coordinate properties for exporting vessel tracks.
- Label · type · L169-L173 — Simple data structure representing a label with identifier, display name, and optional color.
- ExportData · type · L175-L191 — Complete FeatureCollection structure for exporting vessel track data with project metadata and labeled features.
- FilterModeValues · type · L193-L195 — Type for filter configuration storing minimum and maximum numeric bounds keyed by filter name.
