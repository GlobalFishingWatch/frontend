# apps/platform/features/_reports/tabs/others/reports-polygons-timeseries.utils.ts · [[polygon-containment-and-overlap-metrics]] [[report-others-tab-system]]

Utility module that generates time-series data by binning polygon features into temporal intervals and aggregating feature counts by sublayer filters.

- generateTimeBins · function · L13-L36 — Creates an array of time bins spanning from a start to end timestamp at a specified interval granularity.
- toMs · function · L38-L41 — Converts a value of any type to milliseconds, returning NaN for null, undefined, or empty string inputs.
- isPolygonInBin · function · L43-L55 — Determines whether a polygon feature's temporal extent overlaps with a given time bin based on start and end time properties.
- countBySublayer · function · L57-L78 — Counts features per sublayer that fall within a time bin and pass their respective filter conditions.
- GetPolygonsTimeseriesParams · type · L80-L83 — Type definition for parameters passed to the polygon timeseries retrieval function.
- getEmptyPolygonsTimeseries · function · L85-L91 — Constructs an empty timeseries response object with provided sublayers when no data is available.
- getPolygonsTimeseries · function · L93-L136 — Aggregates polygon features into timeseries data points by counting feature occurrences per sublayer within each time bin.
