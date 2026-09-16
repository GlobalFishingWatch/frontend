# libs/responsive-visualizations/src/lib/density.ts · [[density-based-rendering-decision]] [[progressive-data-loading-pattern]]

Module that provides utilities for calculating visualization density, layout dimensions, and support for individual vs. aggregated bar chart and timeseries rendering modes.

- getBarProps · function · L24-L34 — Calculates the number of columns, width per column, and points per row for laying out bar chart elements given a dataset and point size.
- ColumnsStats · type · L36-L39 — Type definition holding aggregate statistics (total sum and maximum value) across visualization columns.
- getColumnsStats · function · L40-L62 — Computes total and maximum values per column, choosing between aggregated key sums or individual item counts based on data availability.
- IsIndividualSupportedParams · type · L64-L73 — Parameter type bundling data, dimensions, time range, and value key configuration needed to determine visualization support.
- IsIndividualSupportedResult · type · L74-L77 — Result type indicating whether individual item rendering is supported and the optimal point size if supported.
- getIsIndividualBarChartSupported · function · L78-L96 — Determines if individual item visualization is feasible for a bar chart by checking total item count and verifying all points fit within height constraints.
- getIsIndividualTimeseriesSupported · function · L98-L128 — Determines if individual item visualization is feasible for a timeseries by validating item count, vertical stacking height, and horizontal time interval span.
