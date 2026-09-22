# apps/platform/features/i18n/i18nDate.tsx · [[internationalization]]

React component that renders a localized date string using the i18n utility, supporting custom Luxon formatting options and optional UTC label display.

- Dates · type · L7-L11 — Defines the shape of props accepted by the I18nDate component, specifying a date value, optional Luxon formatting options, and an optional UTC label flag.
- I18nDate · function · L13-L16 — Renders a localized date string by consuming the useI18nDate hook and delegating formatting logic to it.
