# libs/deck-layer-composer/src/resolvers/dataviews.ts · [[api-type-system]] [[color-ramp-configuration]] [[comparison-mode-resolution]] [[dataset-client]] [[dataset-status-filtering]] [[dataview-resolution-pipeline]] [[fourwings-sublayer-extraction]] [[polymorphic-input-handling]] [[range-propagation-to-sublayers]] [[temporal-metadata-extraction]]

- getDatasetsAvailableIntervals · function · L54-L55 — Extracts and deduplicates the fourwingsV1 interval configurations available across a set of datasets.
- getDataviewAvailableIntervals · function · L57-L86 — Resolves the available time intervals for a dataview by checking its config, dataset configurations, or falling back to defaults.
- getAvailableIntervalsInDataviews · function · L88-L90 — Collects and deduplicates all available intervals across multiple dataviews.
- GetMergedHeatmapAnimatedDataviewParams · type · L92-L99 — Defines optional parameters for configuring merged heatmap and animated dataview resolution.
- getFourwingsDataviewSublayers · function · L101-L151 — Constructs a sublayer configuration from an active fourwings dataview, filtering datasets by status and computing maximum zoom levels.
- getFourwingsDataviewsResolved · function · L153-L251 — Merges multiple fourwings and comparison dataviews into resolved layer configs, splitting and handling auxiliary activity context layers.
- getFourwingsDataviewsMerged · function · L170-L193 — Combines multiple dataviews into a single resolved fourwings dataview with merged sublayers and normalized color ramps.
- groupContextDataviews · function · L253-L263 — Groups context dataviews by dataset composition, with user track dataviews isolated by ID to preserve data loader filtering.
- getContextDataviewsResolved · function · L265-L329 — Merges grouped context dataviews into resolved configs with deduplicated layers and flattened sublayer information.
- ResolverGlobalConfig · type · L342-L363 — Defines global configuration options for dataview resolution including time ranges, visualization modes, and event filters.
- getDataviewsSorted · function · L393-L417 — Sorts dataviews by layer type order, bumping HeatmapAnimated layers in positions mode and grouping by category.
- getComparisonMode · function · L419-L430 — Determines the fourwings comparison mode based on time range parameters and bivariate dataview membership.
- DataviewGroupKey · type · L447-L447 — Defines the union type of grouping keys for categorized dataview collections.
- DataviewsGrouped · type · L448-L448 — Defines a record type mapping dataview group keys to arrays of dataview instances.
- getDataviewsGrouped · function · L450-L462 — Partitions dataviews into typed groups based on predicate matching against activity, detection, environmental, and other categories.
- getDataviewsResolved · function · L464-L579 — Orchestrates resolution of all dataview categories into merged, processed layer configs with appropriate comparison modes and visualization settings.
