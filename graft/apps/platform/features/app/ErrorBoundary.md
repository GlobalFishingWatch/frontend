# apps/platform/features/app/ErrorBoundary.tsx · [[error-handling-reporting]]

- ErrorBoundary · class · L6-L29 — React error boundary class that captures rendering errors, stores them in state, and displays error UI while reporting to Sentry.
- constructor · method · L7-L10 — Initializes the error boundary with null error state.
- getDerivedStateFromError · method · L12-L14 — Captures error during rendering and updates state to trigger error UI display.
- componentDidCatch · method · L16-L21 — Logs the error and reports it to Sentry with component stack context.
- render · method · L23-L28 — Renders error UI when an error is present, otherwise renders child components.
