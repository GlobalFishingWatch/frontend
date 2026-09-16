# apps/platform/features/i18n/request-i18n.server.ts · [[internationalization]] [[server-side-i18n-request-isolation]]

Provides per-request i18n instances scoped via AsyncLocalStorage to handle concurrent requests with language-specific translations on the server.

- I18nInstance · type · L13-L13 — Type alias for the i18next instance type, used throughout this module for type safety.
- getFallbackInstance · function · L22-L27 — Lazily initializes and returns a cached fallback i18n instance for the default language when no request context is available.
- runRequestWithI18n · function · L29-L34 — Executes a function within an isolated async context containing a request-specific i18n instance, loading necessary package namespaces before execution.
- getRequestI18n · function · L36-L38 — Retrieves the current request's i18n instance from async local storage, falling back to the default language instance if no request context exists.
