# apps/platform/features/i18n/i18nNumber.utils.ts · [[internationalization]]

Utility module providing locale-aware number formatting helpers using Intl.NumberFormat with React i18n integration.

- I18Number · type · L7-L7 — Type alias representing a numeric value that can be formatted for internationalization.
- I18NumberOptions · type · L8-L15 — Type defining flexible formatting options for i18n numbers, supporting locale, units, notation styles, and standard Intl.NumberFormat settings.
- formatI18nNumber · function · L17-L32 — Formats a number according to specified locale and i18n options, with fallback to current i18n language and error handling.
- useI18nNumber · function · L34-L37 — React hook that formats a number using the currently active i18n language from translation context.
