# apps/platform/features/_map/dataviews/dataviews.filters.ts · [[dataviews-filter-configuration]] [[geospatial-data-transform-contracts]]

Filter configuration utilities for dataviews, handling filter selection, compatibility, and display logic across multiple datasets.

- FilterCompatibilityOperation · type · L38-L38 — Mode determining whether filter compatibility checks all or any dataset.
- FilterOriginParam · type · L40-L40 — Specifies which vessel identity source (registry or self-reported) to consider for filter rules.
- GetFiltersInDataviewParams · type · L41-L47 — Configuration parameters controlling which filters are displayed and how they behave in a dataview.
- DataviewWithFilters · type · L49-L50 — Union type representing a dataview with accessible filter configuration.
- getIncompatibleFilterSelection · function · L52-L90 — Identifies which filters are disabled by the current filter selections based on compatibility rules.
- isDataviewFilterSupported · function · L92-L106 — Determines if a filter is available for the active datasets in a dataview, considering permissions and incompatibilities.
- getDatasetI18nFilter · function · L108-L110 — Retrieves i18n translation metadata for a filter from a dataset.
- getFilterLabel · function · L112-L130 — Resolves the user-facing label for a filter, consulting dataset i18n, vessel field names, and layer translations in order.
- getFilterEnumLabel · function · L132-L139 — Retrieves the display label for a specific filter option value from dataset i18n.
- getSupportedFilterDatasets · function · L141-L151 — Filters datasets to those that have and allow a specific filter.
- getNotSupportedFilterDatasets · function · L153-L166 — Identifies active datasets that do not support a given filter.
- getCommonFilterTypeInDataview · function · L168-L177 — Determines the data type (enum, range, number) of a filter across active datasets.
- DataviewFilterSelection · type · L179-L182 — Simple label-value pair representing a selectable filter option.
- getCommonFiltersInDataview · function · L184-L282 — Builds the set of available filter options for a filter across active datasets, handling special cases like vessel groups and encounter types.
- getFilterOptionsSelectedInDataview · function · L284-L345 — Extracts the currently selected filter values from a dataview configuration, matching them to available options.
- format · function · L312-L313 — Formats a numeric filter value for display with appropriate i18n localization and decimal handling.
- getFiltersSelectedInDataview · function · L347-L355 — Convenience wrapper returning the selected filter options by combining common filters and current selections.
- getFilterOperationInDataview · function · L357-L365 — Retrieves the logical operator (INCLUDE or EXCLUDE) configured for a filter in the dataview.
- getFilterUnitInDataview · function · L367-L372 — Returns the unit of measurement (if any) for a numeric filter.
- getIsFilterSingleSelection · function · L374-L380 — Checks whether a filter allows only one value to be selected at a time.
- getFilterOperation · function · L382-L385 — Retrieves the filter operation type (AND, OR, etc.) from dataset configuration.
- DataviewFilterConfig · type · L386-L397 — Complete configuration object for rendering and applying a single filter in a dataview.
- getDataviewFilterConfig · function · L399-L449 — Assembles the complete filter configuration including options, type, selection state, and compatibility metadata.
- getFiltersInDataview · function · L451-L495 — Partitions all available filters into enabled and disabled lists based on dataset support and compatibility rules.
