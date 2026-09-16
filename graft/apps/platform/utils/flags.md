# apps/platform/utils/flags.ts · [[flag-metadata-utilities]]

Utility module that provides functions to retrieve, filter, and clean feature flags with internationalization support.

- Flag · type · L4-L4 — Data type representing a feature flag with an identifier and localized display label.
- getFlagById · function · L5-L12 — Retrieves a single flag by ID with its label translated to the specified language.
- getFlagsByIds · function · L14-L18 — Retrieves multiple flags by their IDs, filtering out any that don't exist and returning them with translated labels.
- getFlags · function · L20-L26 — Returns all available flags with their labels translated to the specified language.
- cleanFlagState · function · L28-L30 — Removes all comma characters from a flag state string.
