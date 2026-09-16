# libs/dataviews-client/src/url-workspace/url-workspace.ts · [[dataview-url-workspace]]

URL workspace encoding/decoding module that serializes and deserializes app state through query parameters, including abbreviation, tokenization, and legacy dataview instance migrations.

- Dictionary · type · L14-L14 — Generic type alias for string-keyed objects to standardize record representations throughout the module.
- BaseUrlWorkspace · type · L19-L28 — Core workspace shape defining persistent map, time, and dataview instance state serializable to URL.
- hasParamToBeAbbreviatedDuplicated · function · L110-L113 — Validates that parameter abbreviations are unique and throws an error if any duplication is detected.
- parseIntNumber · function · L121-L121 — Coerces string or numeric values to integers, handling both types transparently.
- safeDecodeURIComponent · function · L126-L133 — Safely decodes URI-encoded strings without throwing on malformed percent-encodings.
- parseLegacyDataviewInstanceConfig · function · L135-L160 — Migrates legacy dataview instance configurations by applying dataset and event migrations.
- parseDataviewInstance · function · L162-L203 — Normalizes URL-encoded dataview configuration values and consolidates legacy multi-vessel-group syntax to single-group.
- deepReplaceKeys · function · L251-L256 — Recursively replaces all keys in a nested object tree using a provided key mapping.
- getObjectTokens · function · L258-L267 — Extracts all repeated string values from a nested object tree, excluding start and end date fields.
- deepTokenizeValues · function · L270-L313 — Compresses repeated string values across a nested object by replacing them with index-based token references.
- tokenizeValues · function · L291-L309 — Inner recursive function that performs the actual token substitution on string values within nested objects.
- deepDetokenizeValues · function · L315-L342 — Expands compressed token references back into their original string values using a token map.
- detokenizeValues · function · L317-L339 — Inner recursive function that replaces token references with their original string values throughout nested objects.
- decoder · function · L345-L367 — Custom query-string decoder that handles URI decoding and parses JavaScript keyword literals like true, false, null, and undefined.
- parseWorkspace · function · L374-L405 — Deserializes a URL query string into a workspace object by decoding, detokenizing, expanding abbreviations, and applying type coercions.
- stringifyWorkspace · function · L407-L412 — Serializes a workspace object into a compact URL query string by abbreviating keys, tokenizing repeated values, and encoding.
