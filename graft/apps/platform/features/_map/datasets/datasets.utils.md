# apps/platform/features/_map/datasets/datasets.utils.ts · [[dataset-utilities-and-filtering]] [[geospatial-data-transform-contracts]] [[localized-dataset-title-generation-for-activity]] [[mocked-geometry-type-warning-suppression]] [[privacy-and-visibility-dataset-classification]]

Utility functions for dataset and dataview operations, including filtering, labeling, icon resolution, geometry classification, and access control based on user type.

- VesselInstanceDatasets · type · L35-L42 — Type definition for organizing dataset IDs needed to configure a vessel instance display.
- getVesselTrackDatasetIds · function · L44-L57 — Extracts track and real-time track dataset IDs from a vessel's info dataset and available track options.
- bySubcategory · function · L51-L52 — Helper that finds a dataset matching a given subcategory within related track datasets.
- isPrivateDataset · function · L66-L67 — Determines whether a dataset is private based on its ID prefix.
- isPrivateVesselGroup · function · L69-L70 — Checks if a vessel group ID is private by testing its suffix.
- isGFWOnlyDataset · function · L77-L78 — Identifies datasets that are restricted to GFW internal use only.
- getIsSkylightDataset · function · L80-L81 — Checks whether a dataset is the Skylight VIIRS detection product.
- isRealTimeDataset · function · L83-L85 — Determines if a dataset provides real-time activity data.
- GetDatasetLabelParams · type · L89-L89 — Type definition for minimal parameters needed to render a dataset label.
- getDatasetLabel · function · L90-L97 — Generates a display label for a dataset, optionally adding privacy and GFW-only indicators.
- getDatasetMatchesSearch · function · L99-L106 — Filters datasets by matching a search query against their name and description.
- getDataviewsSources · function · L108-L117 — Extracts and deduplicates the data sources from a collection of dataviews.
- getDatasetTypeIcon · function · L119-L139 — Maps dataset type and geometry to a UI icon that visually represents the data structure.
- getIsBQEditorDataset · function · L140-L149 — Identifies custom BigQuery editor datasets by category and subcategory.
- warnMissingGeometryType · function · L152-L158 — Logs a warning once per dataset that lacks geometry type configuration.
- groupDatasetsByGeometryType · function · L160-L190 — Organizes datasets into buckets by their geometry type (tracks, polygons, points, gridded, or BigQuery).
- getGeometryTypeLabel · function · L192-L207 — Translates geometry type strings into localized human-readable labels.
- getDatasetSourceIcon · function · L209-L235 — Maps a dataset's source to a branded icon representing the data provider.
- getDatasetTitleByDataview · function · L237-L293 — Generates a display title for a dataview, customizing it based on dataset category and source type.
- getDatasetsInDataview · function · L295-L326 — Extracts all dataset IDs configured in a dataview, filtering by guest user permissions if needed.
- getDatasetsInDataviews · function · L328-L343 — Collects and deduplicates all dataset IDs across multiple dataviews with guest user filtering.
- getVesselGroupInDataview · function · L345-L351 — Retrieves vessel group filter IDs from a dataview, optionally excluding private groups.
- getVesselGroupsInDataviews · function · L353-L364 — Aggregates and deduplicates vessel group IDs across dataviews with guest user filtering.
- getActiveDatasetsInActivityDataviews · function · L366-L372 — Extracts the actively selected dataset IDs from a list of activity-type dataviews.
- getLatestEndDateFromDatasets · function · L374-L379 — Retrieves the most recent end date across datasets, falling back to the default time range.
- getActiveDatasetsInDataview · function · L381-L396 — Returns the dataset objects that are actively configured within a dataview.
- getActiveActivityDatasetsInDataviews · function · L398-L407 — Filters active datasets in multiple dataviews by matching configured dataset IDs.
- getEventsDatasetsInDataview · function · L409-L423 — Extracts event-type datasets from a dataview that have vessel ID filters configured.
- filterDatasetsByUserType · function · L425-L438 — Filters datasets based on user permissions, allowing public-only for guests or preferring full versions for authenticated users.
