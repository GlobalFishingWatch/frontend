---
name: Track-Labeler UI Components
slug: track-labeler-ui-components
type: system
sources:
  - path: apps/track-labeler/src/features/error/ErrorPlaceholder.tsx
    hash: 9a340c5c951e0ee54c01c23bba86e4d3a2a32bc86704a3e3d9135aea239589fa
  - path: apps/track-labeler/src/features/loader/loader.tsx
    hash: bbeeb8046f1d23ba4d84ec21817ac1969b9c730999b9e96c68e31e3d9efb4c46
sources_digest: b08e0abcfc895f1f210046e16e2aee46ebd72c9aa4ae0aaf6d086a1715ba7d28
links:
  - to: track-labeler-interactive-vessel-track-labeling
    relation: uses
    description: >-
      ErrorPlaceholder and Loader components render during error and loading
      states
generator:
  version: 1
covers:
  - symbol: ErrorPlaceHolder
    kind: function
    at: 'apps/track-labeler/src/features/error/ErrorPlaceholder.tsx:L5-L14'
  - symbol: LoaderProps
    kind: interface
    at: 'apps/track-labeler/src/features/loader/loader.tsx:L7-L13'
  - symbol: Loader
    kind: function
    at: 'apps/track-labeler/src/features/loader/loader.tsx:L15-L24'
---

<!-- context:generated:start -->

## Summary

Minimal presentational components for track-labeler: ErrorPlaceholder renders styled error messages with optional child content; Loader displays branded loading spinner with unused props (invert, timeout, mini, encounter, carrier) suggesting incomplete feature development. Loader includes ARIA attributes (role='alert', aria-live='assertive') for accessibility but uses generic return type defeating TypeScript safety.

## Related

- uses [[track-labeler-interactive-vessel-track-labeling]] — ErrorPlaceholder and Loader components render during error and loading states

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
