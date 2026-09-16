# apps/platform/features/app/ErrorBoundaryRouter.tsx · [[error-handling-reporting]]

Module that exports an error boundary component to handle and display routing errors, including automatic recovery from stale module load failures.

- isModuleLoadError · function · L22-L28 — Determines whether an error is a module load failure caused by stale chunks or deployment asset mismatches.
- RouterErrorBoundary · function · L30-L60 — React component that catches routing errors, automatically reloads the page if caused by stale modules, and displays error details to the user.
