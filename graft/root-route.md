---
name: Root Route
slug: root-route
type: file
sources:
  - path: apps/platform/routes/__root.tsx
    hash: 6c297d1e485a4126af609ebcdd1f21b2000adf5c6f676806d507cc2340474c1c
sources_digest: b89aa9ba073a3e63c0fcda8135a987e493f06782345dfa70d8ce053f2f9ff257
links:
  - to: router-core
    relation: implements
    description: Defines root route structure used by router factory functions
  - to: seo-and-metadata
    relation: depends_on
    description: Delegates meta tag generation to child routes via getRouteHead
generator:
  version: 1
covers:
  - symbol: PanelWidthsState
    kind: type
    at: 'apps/platform/routes/__root.tsx:L29-L33'
  - symbol: loadPanelWidths
    kind: function
    at: 'apps/platform/routes/__root.tsx:L41-L47'
  - symbol: loadUser
    kind: function
    at: 'apps/platform/routes/__root.tsx:L49-L55'
  - symbol: RootDocument
    kind: function
    at: 'apps/platform/routes/__root.tsx:L73-L107'
  - symbol: RootComponent
    kind: function
    at: 'apps/platform/routes/__root.tsx:L109-L143'
---

<!-- context:generated:start -->

## Summary

Top-level route and HTML document scaffold for the platform, configuring permanent redirects (/index → MAP path), error boundary (RouterErrorBoundary), and SSR-safe loader that fetches user auth state and layout dimensions in parallel with fallbacks on failure (cached indefinitely with gcTime/staleTime: infinity). Renders RootDocument with GTM instrumentation, I18nSSRProvider, Roboto font preload, and route Outlet. Skips user loading on /login path.

## Related

- implements [[router-core]] — Defines root route structure used by router factory functions
- depends on [[seo-and-metadata]] — Delegates meta tag generation to child routes via getRouteHead

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
