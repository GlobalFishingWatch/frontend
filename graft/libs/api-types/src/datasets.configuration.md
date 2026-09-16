# libs/api-types/src/datasets.configuration.ts · [[api-types-type-definitions]] [[temporal-data-versioning-constraints]]

Defines TypeScript types and enums for dataset configuration across multiple data formats and visualization layers.

- DatasetTypes · enum · L1-L16 — Enumerates the available dataset types supported by the API, mapping semantic names to versioned identifiers.
- ApiSupportedVersions · type · L18-L18 — Defines the API version compatibility constraint for dataset configurations.
- ContextLayerFormat · type · L20-L20 — Specifies the supported file formats for geographic context layer data.
- ContextLayerV1Configuration · type · L22-L24 — Configures properties for context layer datasets, including optional property identification.
- UserContextLayerV1Configuration · type · L26-L32 — Defines configuration for user-uploaded context layers with import settings and property mapping.
- UserFourwingsV1Configuration · type · L34-L46 — Configures user-uploaded gridded raster datasets with aggregation, band selection, and spatial parameters.
- TemporalContextLayerV1Configuration · type · L48-L48 — Marker type for temporal context layer configurations with no configurable properties.
- UserTracksV1Configuration · type · L50-L53 — Configures user-uploaded track datasets with file path and entity identification.
- PmTilesV1Configuration · type · L55-L58 — Configures PMTiles vector tile archive datasets with optional property identification.
- AggregationFunction · type · L60-L60 — Defines the aggregation methods (average or sum) for gridded data aggregation.
- EventsV1Configuration · type · L61-L64 — Configures point event datasets with optional aggregation function and zoom level bounds.
- FourwingsInterval · type · L66-L66 — Specifies temporal grouping intervals for fourwings gridded data analysis.
- FourwingsPositionProperty · type · L67-L67 — Names the individual properties tracked in fourwings position tile records.
- FourwingsPositionProperties · type · L68-L71 — Pairs a position property identifier with its expected data type.
- FourwingsReportGrouping · type · L73-L73 — Specifies grouping dimensions for fourwings aggregated reporting.
- FourwingsV1Configuration · type · L74-L82 — Configures fourwings gridded datasets with aggregation, temporal intervals, and grouping options.
- TracksV1Configuration · type · L84-L84 — Marker type for track datasets with no configurable properties.
- VesselsV1Configuration · type · L86-L86 — Marker type for vessel entity datasets with no configurable properties.
- InsightSource · type · L88-L88 — Marker type for insight data sources with no configurable properties.
- InsightsV1Configuration · type · L90-L92 — Configures insight datasets with optional data source definitions.
- BulkDownloadFormat · type · L94-L94 — Defines export formats for bulk data downloads.
- BulkDownloadV1Configuration · type · L95-L95 — Marker type for bulk download datasets with no additional configuration.
- DataDownloadDatasetFile · type · L97-L102 — Describes a file asset in a data download dataset with metadata.
- DataDownloadV1Configuration · type · L103-L110 — Configures data download datasets with documentation, licensing, and file manifests.
- ThumbnailsV1Configuration · type · L112-L114 — Configures thumbnail datasets with optional scale adjustments.
- DatasetConfigurationByType · type · L116-L132 — Unions all dataset-type-specific configurations as optional properties indexed by configuration name.
- TimeFilterType · type · L134-L134 — Defines the temporal filter modes available for dataset queries.
- DatasetConfigurationSourceFormat · type · L135-L136 — Enumerates the input file formats accepted by dataset importers.
- DatasetGeometryType · type · L138-L138 — Categorizes the spatial representation modes supported by frontend rendering.
- DatasetGeometryToGeoJSONGeometry · type · L139-L141 — Maps each geometry type to its compatible GeoJSON geometry type strings.
- FrontendConfiguration · type · L142-L163 — Aggregates frontend rendering parameters including geometry type, time filtering, and visual styling.
- SharedDatasetConfiguration · type · L165-L168 — Base configuration object shared across all datasets, including API version and frontend settings.
- DatasetTypeToConfigurationType · type · L185-L185 — Derives the type of the dataset-type-to-configuration mapping constant for generic type checking.
- GetConfigurationType · type · L187-L188 — Utility type that retrieves the configuration type name for a given dataset type key.
- DatasetConfiguration · type · L190-L199 — Generic configuration type that selects and requires the appropriate configuration properties based on dataset type.
