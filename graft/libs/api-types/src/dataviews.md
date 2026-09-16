# libs/api-types/src/dataviews.ts · [[api-types-type-definitions]] [[dataview-configuration-layer-rendering]] [[discriminated-union-type-safety-via-generics]] [[filter-incompatibility-composition-rules]]

Defines TypeScript type definitions and enums for dataview configuration, layer types, filters, and workspace layer instances across the GFW API.

- ColorCyclingType · type · L6-L6 — Specifies the color cycling mode for visual layers: fill or line.
- FilterOperator · type · L9-L9 — Defines whether a filter applies as inclusion or exclusion.
- FilterOperators · type · L10-L10 — Maps filter field names to their include/exclude operator modes.
- DataviewType · enum · L13-L45 — Enumerates the deck.gl layer types supported by the dataview system.
- DataviewContexLayerConfig · type · L47-L50 — Pairs a dataset identifier with its configuration for context layers.
- FourwingsGeolocation · type · L52-L52 — Specifies geographic resolution levels for fourwings cluster data.
- ClusterMaxZoomLevelConfig · type · L55-L55 — Maps each geolocation level to its maximum zoom level for clustering.
- DataviewConfigVessel · type · L57-L82 — Stores vessel-specific configuration including datasets, time ranges, and display settings.
- DataviewConfig · type · L84-L169 — Master configuration object for all dataview layer types, combining vessel settings with visualization and filtering options.
- DataviewDatasetConfigParam · type · L171-L174 — Represents a single named parameter passed to dataset endpoints.
- DataviewDatasetFilter · type · L178-L178 — Generic filter dictionary applied to datasets.
- DatasetsMigration · type · L179-L179 — Maps old dataset identifiers to their replacements during schema migration.
- DataviewDatasetConfig · type · L180-L187 — Configures dataset access including endpoint, query parameters, and filters.
- DataviewCreation · type · L189-L195 — Input payload for creating a new dataview with name, app context, and configuration.
- DataviewInfoConfigField · type · L197-L202 — Defines metadata fields displayed in info panels with type and visibility constraints.
- DataviewInfoConfig · type · L204-L206 — Organizes display fields for dataview information panels.
- DataviewEventsConfig · type · L208-L212 — Configures visibility of event icons and authorization status in event layers.
- IncomatibleFilterConfig · type · L214-L219 — Defines which filters become disabled when a specific filter value is selected.
- DataviewFiltersConfig · type · L221-L225 — Specifies filter ordering and incompatibility rules to prevent conflicting selections.
- DataviewCategory · enum · L228-L244 — Categorizes dataviews by domain for sorting, filtering, and resolver logic.
- Dataview · type · L247-L265 — Base layer definition template that serves as the schema for a dataview before workspace instantiation.
- DataviewInstanceOrigin · type · L267-L267 — Identifies the context where a dataview instance is being used.
- DataviewInstance · type · L270-L279 — Runtime dataview with optional configuration overrides and user customization for specific contexts.
