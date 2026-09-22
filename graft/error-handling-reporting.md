---
name: Error Handling & Reporting
slug: error-handling-reporting
type: system
sources:
  - path: apps/platform/features/app/ErrorBoundary.tsx
    hash: df1160146b25f5002fb66ba2b3c040b48ebf68385679c12a8edaaaf40ad1afa0
  - path: apps/platform/features/app/ErrorBoundaryRouter.tsx
    hash: ed4657cce94e94a163e2a865943dc2f4185f08bfed9922ffed28121a8430c57a
  - path: apps/platform/features/app/ErrorBoundaryUI.tsx
    hash: 033e5e0370587c36ea2d7be05755518184189f892386253b6a0a727e6fba391e
  - path: apps/platform/features/app/sentry.ts
    hash: 0ecc3a04820e3bbde61b19a87f59f18b308ef5d4d22d84179a9de46acad59611
sources_digest: d7a1b7b55ed87b7ead2f9fa7bd261f4680fd89d6b4dbef6985ef9b0247443539
links:
  - to: feedback-modals
    relation: uses
    description: >-
      ErrorBoundaryUI lazy-loads FeedbackModal and dispatches setModalOpen to
      report errors
  - to: user-authentication-session
    relation: uses
    description: >-
      ErrorBoundaryUI checks selectIsGFWUser to restrict technical details to
      authenticated users only
generator:
  version: 1
covers:
  - symbol: ErrorBoundary
    kind: class
    at: 'apps/platform/features/app/ErrorBoundary.tsx:L6-L29'
  - symbol: constructor
    kind: method
    at: 'apps/platform/features/app/ErrorBoundary.tsx:L7-L10'
  - symbol: getDerivedStateFromError
    kind: method
    at: 'apps/platform/features/app/ErrorBoundary.tsx:L12-L14'
  - symbol: componentDidCatch
    kind: method
    at: 'apps/platform/features/app/ErrorBoundary.tsx:L16-L21'
  - symbol: render
    kind: method
    at: 'apps/platform/features/app/ErrorBoundary.tsx:L23-L28'
  - symbol: isModuleLoadError
    kind: function
    at: 'apps/platform/features/app/ErrorBoundaryRouter.tsx:L22-L28'
  - symbol: RouterErrorBoundary
    kind: function
    at: 'apps/platform/features/app/ErrorBoundaryRouter.tsx:L30-L60'
  - symbol: ErrorBoundaryUIProps
    kind: interface
    at: 'apps/platform/features/app/ErrorBoundaryUI.tsx:L17-L19'
  - symbol: ErrorBoundaryUI
    kind: function
    at: 'apps/platform/features/app/ErrorBoundaryUI.tsx:L21-L90'
  - symbol: ErrorBoundaryTag
    kind: type
    at: 'apps/platform/features/app/sentry.ts:L3-L3'
  - symbol: reportRouteError
    kind: function
    at: 'apps/platform/features/app/sentry.ts:L5-L16'
---

<!-- context:generated:start -->

## Summary

Multi-layer error boundary system catching exceptions at render time and during lazy route transitions, with specialized recovery logic for stale module imports and integration with Sentry for error telemetry. Distinguishes between deployment mismatches and actual application errors.

## Related

- uses [[feedback-modals]] — ErrorBoundaryUI lazy-loads FeedbackModal and dispatches setModalOpen to report errors
- uses [[user-authentication-session]] — ErrorBoundaryUI checks selectIsGFWUser to restrict technical details to authenticated users only

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
