# apps/platform/features/i18n/i18nDate.utils.ts · [[internationalization]]

Utility module for formatting dates with internationalization support using the application's i18n configuration and Luxon date library.

- formatI18DateParams · type · L12-L16 — Configuration options for internationalized date formatting including locale, format style, and UTC label visibility.
- formatI18nDate · function · L20-L36 — Converts a date to a localized string representation with optional UTC suffix based on format type.
- useI18nDate · function · L38-L45 — React hook that formats a date using the current i18n language from the translation context.
