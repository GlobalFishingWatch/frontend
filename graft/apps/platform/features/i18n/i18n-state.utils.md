# apps/platform/features/i18n/i18n-state.utils.ts · [[internationalization]]

- I18nResourceValue · type · L5-L5 — Recursive type representing i18n translation values as strings or nested objects.
- I18nServerState · type · L7-L10 — Data structure holding the initial language and i18n resource store for server-side hydration.
- isValidI18nServerState · function · L12-L27 — Type guard that validates an i18n server state object has required fields and a normalized language entry.
- serializeI18nState · function · L29-L40 — Extracts the current language and resource data from an i18next instance into a serializable server state.
