# apps/port-labeler/src/types/index.ts · [[port-data-metadata-types]]

Type definitions and interfaces for the port-labeler application.

- Locale · enum · L1-L3 — Enum that defines available language locales for the application.
- WorkspaceParam · type · L5-L6 — Union type that constrains valid workspace parameter names for map and UI state.
- QueryParams · type · L8-L10 — Type that defines optional query parameter mappings for any valid workspace parameter.
- MapCoordinates · type · L12-L17 — Type that represents geographic coordinates and zoom level for map positioning.
- PortPositionFeature · type · L19-L30 — Type that represents a GeoJSON feature for a single port position with coordinates and styling.
- PortAreaFeature · type · L32-L38 — Type that represents a GeoJSON feature for a port area polygon geometry.
- PortPositionsGeneratorConfig · interface · L40-L46 — Interface that configures a GeoJSON data source for rendering port position features.
- AreaGeneratorConfig · interface · L48-L54 — Interface that configures a GeoJSON data source for rendering port area features.
- PortSubarea · interface · L56-L60 — Interface that represents a port subarea with identity, name, and optional color styling.
- PortPosition · interface · L62-L74 — Interface that represents a port location with geographic, administrative, and labeling metadata.
