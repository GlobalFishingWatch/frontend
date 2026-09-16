# apps/platform/features/_reports/report-dataview-cleaners.ts · [[bundle-size-optimization-through-module-isolation]] [[report-data-cleaning-utilities]]

A utility module that exports functions to clean report-specific dataview configurations before workspace persistence or parsing.

- cleanAggregateByPropertyDataviewFromReport · function · L14-L26 — Removes the aggregateByProperty configuration from a dataview instance while preserving all other properties.
- cleanDatasetComparisonDataviewInstances · function · L28-L34 — Filters out temporary dataset comparison dataview instances by excluding those whose IDs contain the comparison suffix.
