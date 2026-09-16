---
name: Server-Side Rendering (SSR) Safety Pattern
slug: server-side-rendering-ssr-safety-pattern
type: concept
sources:
  - path: apps/platform/features/nav/PlatformNav.tsx
    hash: 39e7e552d4738dba74aa8e02c2ba3753054bdfb92aa155063e71e806ff2a78bf
  - path: apps/platform/features/nav/WhatsNew.tsx
    hash: e157cfc004273cd486b5c4d4346287c1f2ea2646e4e5ca03f826f02791d0eec6
  - path: apps/platform/hooks/ssr.hooks.ts
    hash: 244cb79df674dbe72d8c17c7eb1b453c484e09251867155e7584f24cc6637418
sources_digest: 12e5caed62625e24b71d1909577f845fe2376c842eae752d891e603ddfff02ec
links:
  - to: navigation-system
    relation: uses
    description: PlatformNav checks hydration before accessing lastVisitedWorkspace state
generator:
  version: 1
covers:
  - symbol: PlatformNav
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L56-L370'
  - symbol: isSectionExpanded
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L175-L175'
  - symbol: renderIconAndLabel
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L177-L186'
  - symbol: renderItemContent
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L188-L242'
  - symbol: renderRow
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L244-L254'
  - symbol: renderSection
    kind: function
    at: 'apps/platform/features/nav/PlatformNav.tsx:L256-L315'
  - symbol: parseVersion
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L17-L20'
  - symbol: getClientWhatsNewSnapshot
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L24-L31'
  - symbol: getServerWhatsNewSnapshot
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L33-L35'
  - symbol: dismissWhatsNewSnapshot
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L37-L40'
  - symbol: WhatsNew
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L42-L79'
  - symbol: dismissNewVersionHint
    kind: function
    at: 'apps/platform/features/nav/WhatsNew.tsx:L55-L58'
  - symbol: subscribeToHydrationStore
    kind: function
    at: 'apps/platform/hooks/ssr.hooks.ts:L3-L5'
  - symbol: getClientHydrationSnapshot
    kind: function
    at: 'apps/platform/hooks/ssr.hooks.ts:L7-L9'
  - symbol: getServerHydrationSnapshot
    kind: function
    at: 'apps/platform/hooks/ssr.hooks.ts:L11-L13'
  - symbol: useIsClientHydrated
    kind: function
    at: 'apps/platform/hooks/ssr.hooks.ts:L15-L21'
---

<!-- context:generated:start -->

## Summary

Ensures components avoid hydration mismatches and SSR errors via useIsClientHydrated hook, which defers client-only rendering until after DOM hydration. Components check this flag before accessing localStorage, browser APIs, or version comparisons that are unavailable server-side.

## Related

- uses [[navigation-system]] — PlatformNav checks hydration before accessing lastVisitedWorkspace state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
