# apps/platform/features/i18n/I18nSSRProvider.tsx · [[internationalization]] [[ssr-hydration-dehydration]]

This module exports an I18n provider component that configures i18next for server-side and client-side rendering with language-aware state hydration.

- createI18nFromState · function · L10-L26 — Initializes an i18next instance from server-side state with proper language configuration, namespaces, and resources.
- I18nSSRProvider · function · L28-L38 — Provides the appropriate i18n instance (global or server-created) to child components based on the execution environment.
