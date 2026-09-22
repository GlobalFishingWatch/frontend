# libs/api-types/src/stats.ts · [[aggregated-analytics-across-vessel-groups]] [[api-types-type-definitions]] [[geospatial-filtering-region-hierarchies]]

Type definitions for statistics API responses and request parameters related to vessel and detection data.

- StatType · type · L1-L1 — Enumeration of statistics types: vessels or detections.
- StatsParams · type · L2-L2 — Enumeration of query parameters accepted by the statistics API: FLAGS or VESSEL-IDS.
- StatsIncludes · type · L3-L3 — Enumeration of optional data includes for statistics responses: total count, time series, or events grouped.
- StatsGroupBy · type · L4-L15 — Enumeration of valid grouping dimensions for statistics queries: flags, gear types, regional classifications, and marine protected areas.
- StatField · type · L17-L26 — Enumeration of measurable fields that can appear in statistics records: identifiers, flags, vessel IDs, activity duration, gear type, and geographic bounds.
- StatFields · type · L28-L30 — Composite type that maps each StatField to a numeric value and associates the record with a specific StatType.
- StatsByVessel · type · L32-L40 — Record containing aggregated statistics for a single vessel including event counts, duration, identity, flag, and vessel characteristics.
- StatsGroupedBy · type · L42-L47 — Container for grouped statistics results, holding an array of named groups with their corresponding numeric values.
