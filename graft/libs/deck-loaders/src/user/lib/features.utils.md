# libs/deck-loaders/src/user/lib/features.utils.ts · [[conjunctive-filter-logic-and-semantics]] [[feature-filtering-system]] [[range-vs-categorical-filter-detection]]

Utility module for filtering and validating feature properties in GFW deck loaders.

- FilterOperators · type · L3-L3 — Type alias mapping filter field IDs to their operators for controlling how filter values are applied.
- isNumeric · function · L5-L9 — Determines whether a string or number input represents a valid numeric value.
- isFeatureInFilter · function · L11-L40 — Tests whether a feature's property matches the filter criteria, supporting range queries for numeric values and inclusion/exclusion for categorical values.
- isFeatureInFilters · function · L42-L51 — Validates that a feature passes all active filters by checking every filter condition against the feature's properties.
