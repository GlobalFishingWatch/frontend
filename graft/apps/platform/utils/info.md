# apps/platform/utils/info.ts · [[platform-app-utilities]] [[vessel-info-formatting]]

Utility module providing formatting and label generation functions for vessel information display, including ship type, gear type, and field-specific data transformations.

- upperFirst · function · L21-L23 — Capitalizes the first letter of a text string and converts the rest to lowercase.
- formatNumber · function · L25-L30 — Formats a number with locale-aware thousand separators and adaptive decimal precision.
- getVesselShipTypeLabel · function · L32-L53 — Translates and formats vessel ship type codes into human-readable, deduplicated, sorted labels in the user's language.
- getVesselGearTypeLabel · function · L55-L83 — Translates and formats vessel gear type codes into human-readable, sorted labels, handling login-required scenarios and undefined values.
- formatInfoField · function · L85-L190 — Formats diverse vessel information fields based on type, applying type-specific transformations, translations, and fallback value handling.
- getVesselOtherNamesLabel · function · L192-L198 — Formats a list of alternative vessel names as a localized 'aka' suffix string.
- getDetectionsTimestamps · function · L201-L203 — Parses and sorts comma-separated detection timestamps from a vessel object.
- sortOptionsAlphabetically · function · L205-L209 — Sorts an array of labeled options alphabetically by their label property.
