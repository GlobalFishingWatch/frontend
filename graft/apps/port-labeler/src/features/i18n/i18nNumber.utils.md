# apps/port-labeler/src/features/i18n/i18nNumber.utils.ts · [[i18n-system]]

Utility module providing internationalized number formatting functions for React applications.

- I18Number · type · L7-L7 — Type alias representing a number value that can be either a string or numeric type for i18n formatting.
- I18NumberOptions · type · L8-L15 — Configuration type for number formatting that accepts either a locale string or extended Intl options with i18n-specific properties like unit and notation.
- formatI18nNumber · function · L17-L32 — Formats a number according to locale-specific rules using Intl.NumberFormat with fallback error handling.
- useI18nNumber · function · L34-L37 — React hook that formats a number using the current i18n language from the translation context.
