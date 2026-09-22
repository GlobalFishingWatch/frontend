# apps/platform/features/app/sentry.ts · [[error-handling-reporting]]

Sentry integration module for capturing and reporting errors from route boundaries and React error boundaries in the application.

- ErrorBoundaryTag · type · L3-L3 — Type alias that defines the allowed categories of error boundaries in the application.
- reportRouteError · function · L5-L16 — Captures and reports errors from route loaders, renders, or React error boundaries to Sentry in production environments.
