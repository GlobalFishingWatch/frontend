# libs/api-client/src/utils/search.ts · [[advanced-search-query-builder]]

Utility module that exports search query builders and field definitions for advanced vessel search functionality.

- MultiSelectOption · type · L5-L10 — Generic type defining a select dropdown option with optional aliases and tooltip metadata.
- AdvancedSearchQueryFieldKey · type · L45-L45 — Type extracting the union of valid field keys from the ADVANCED_SEARCH_QUERY_FIELDS constant.
- AdvancedSearchQueryField · type · L47-L52 — Type representing a single field constraint in an advanced search query with optional operator and OR-combination flag.
- AdvancedSearchOperator · type · L54-L54 — Type defining the allowed comparison operators for field-level search constraints.
- AdvancedSearchQueryFieldParams · type · L55-L58 — Type specifying the operator and optional transformation function applied to a search field during query building.
- withQuotationMarks · function · L60-L64 — Wraps field values in single quotes, preserving array structures for multi-value fields.
- transform · function · L62-L62 — Applies single-quote wrapping to a single string value.
- toUpperCaseWithQuotationMarks · function · L66-L70 — Converts field values to uppercase and wraps them in single quotes for case-insensitive exact matching.
- transform · function · L68-L68 — Applies uppercase conversion and single-quote wrapping to a single string value.
- toUpperCaseWithWildcardsAndQuotationMarks · function · L72-L76 — Converts field values to uppercase, wraps them in quotes, and adds SQL wildcards for substring pattern matching.
- transform · function · L74-L74 — Applies uppercase conversion, wildcard wrapping, and single-quote wrapping to a single string value.
- getAdvancedSearchQuery · function · L180-L234 — Transforms an array of field constraints into a SQL-like query string with proper operators, transformations, and AND/OR logic.
- getFieldQuery · function · L184-L220 — Converts a single field constraint into a query fragment, applying field-specific transformations and handling array-to-OR expansion.
- getFieldValue · function · L192-L212 — Maps a field key to its target query path, applying special-case routing for id, owner, shiptypes, and geartypes fields.
