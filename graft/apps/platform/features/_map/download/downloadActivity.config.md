# apps/platform/features/_map/download/downloadActivity.config.ts · [[download-validation-format-selection]]

Configuration file exporting enums and helper functions for heatmap download UI options and settings.

- HeatmapDownloadTab · enum · L5-L9 — Enum defining the three download tab categories: by vessel, gridded data, or environmental data.
- HeatmapDownloadFormat · enum · L11-L16 — Enum defining supported download file formats: GeoTIFF, JSON, CSV, and Geopackage.
- GroupBy · enum · L18-L25 — Enum defining aggregation dimensions for vessel data: by vessel ID, MMSI, gear type, flag, or flag+gear combined.
- TemporalResolution · enum · L27-L33 — Enum defining time granularities for downloaded data: full range, hourly, daily, monthly, or yearly.
- SpatialResolution · enum · L35-L39 — Enum defining spatial grid resolutions for heatmap downloads: low, high, or very high precision.
- getBaseGroupByOptions · function · L85-L104 — Returns the core grouping options (MMSI, flag, gear type, and flag+gear) shared across vessel and gridded downloads.
- getVesselGroupOptions · function · L105-L111 — Returns grouping options for by-vessel downloads by combining a none option with base grouping choices.
- getGriddedGroupOptions · function · L113-L119 — Returns grouping options for gridded downloads by combining a none option with base grouping choices.
- getTemporalResolutionOptions · function · L139-L156 — Returns temporal granularity options for downloads: full range, daily, monthly, and yearly aggregations.
