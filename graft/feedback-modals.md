---
name: Feedback & Modals
slug: feedback-modals
type: system
sources:
  - path: apps/platform/features/app/ErrorBoundaryUI.tsx
    hash: 033e5e0370587c36ea2d7be05755518184189f892386253b6a0a727e6fba391e
sources_digest: 5c11c170503df40eedc9770a687f800ad94f5c072f073ebae7eab11277077c46
links:
  - to: error-handling-reporting
    relation: implements
    description: Provides feedback modal opened by ErrorBoundaryUI to report exceptions
generator:
  version: 1
covers:
  - symbol: ErrorBoundaryUIProps
    kind: interface
    at: 'apps/platform/features/app/ErrorBoundaryUI.tsx:L17-L19'
  - symbol: ErrorBoundaryUI
    kind: function
    at: 'apps/platform/features/app/ErrorBoundaryUI.tsx:L21-L90'
---

<!-- context:generated:start -->

## Summary

Redux-based modal state management for error reporting feedback forms and other UI modals. Lazy-loaded to reduce bundle size; integrated with error boundaries for exception reporting.

## Related

- implements [[error-handling-reporting]] — Provides feedback modal opened by ErrorBoundaryUI to report exceptions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
