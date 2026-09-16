---
name: SSR Hydration & Dehydration
slug: ssr-hydration-dehydration
type: concept
sources:
  - path: apps/platform/features/i18n/i18n.dehydrated-state.ts
    hash: 906c47eac274fe0f796525bca7ead2dab71714ed9090efb1ca19bcd86812d158
  - path: apps/platform/features/i18n/I18nSSRProvider.tsx
    hash: e4669195ff5b42069e2ac8c71c893aa79cf49118ecfaf330ca572e0aa1e926bd
sources_digest: f810b15baa087b8b8ae8b798434f39089a552f4af0cfa689fb1eda613a84d62d
links:
  - to: internationalization
    relation: part_of
    description: >-
      Enables fast SSR bootstrap by pre-loading serialized i18n state into
      client without requiring Suspense or async initialization
  - to: router
    relation: depends_on
    description: >-
      Leverages TanStack Router's dehydrated data mechanism to transport
      server-computed i18n state to client
generator:
  version: 1
covers:
  - symbol: createI18nFromState
    kind: function
    at: 'apps/platform/features/i18n/I18nSSRProvider.tsx:L10-L26'
  - symbol: I18nSSRProvider
    kind: function
    at: 'apps/platform/features/i18n/I18nSSRProvider.tsx:L28-L38'
  - symbol: DehydratedRouterData
    kind: type
    at: 'apps/platform/features/i18n/i18n.dehydrated-state.ts:L4-L4'
  - symbol: TanStackBootstrapWindow
    kind: type
    at: 'apps/platform/features/i18n/i18n.dehydrated-state.ts:L6-L9'
  - symbol: getDehydratedRootI18nState
    kind: function
    at: 'apps/platform/features/i18n/i18n.dehydrated-state.ts:L11-L18'
---

<!-- context:generated:start -->

## Summary

Two-way serialization pattern where server precomputes and embeds i18n state (language, resources, initial store) in HTML via TanStack Router's dehydrated data structure, and client extracts it via window.$_TSR.router.dehydratedData for instant hydration without async fetches or Suspense boundaries.

## Related

- part of [[internationalization]] — Enables fast SSR bootstrap by pre-loading serialized i18n state into client without requiring Suspense or async initialization
- depends on [[router]] — Leverages TanStack Router's dehydrated data mechanism to transport server-computed i18n state to client

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
