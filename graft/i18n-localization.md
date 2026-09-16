---
name: i18n & Localization
slug: i18n-localization
type: concept
sources:
  - path: apps/platform/features/app/app-shell.hooks.ts
    hash: bf6d4452da0b4a931bccfbbd71ef3ba9d34fee05ae13923815a6fb3ca90d84b1
  - path: apps/platform/features/app/app-store.hooks.ts
    hash: 2b45ec7e93d17dc27e11c7b1baba46adfb51bf5c43284488be1a26994130f9b3
  - path: apps/platform/features/data/regions/regions.hooks.ts
    hash: 26878784bbdd59987e7c0b98151068fbdd79ad36ca4a28d6b2ca52b0360e74dd
sources_digest: a46d3bb93fefb5cc5b1735d6ce520053fd59207e7f80a4e6bbde9b8ec11ae838
links:
  - to: analytics-tracking
    relation: produces
    description: Current language tracked in analytics context
  - to: cms-content-management
    relation: uses
    description: Locale preference drives CMS loader query parameters and fallback behavior
generator:
  version: 1
covers:
  - symbol: useAppShell
    kind: function
    at: 'apps/platform/features/app/app-shell.hooks.ts:L11-L21'
  - symbol: useAppStore
    kind: function
    at: 'apps/platform/features/app/app-store.hooks.ts:L34-L64'
  - symbol: useRegionTranslationsById
    kind: function
    at: 'apps/platform/features/data/regions/regions.hooks.ts:L16-L39'
  - symbol: useRegionNamesByType
    kind: function
    at: 'apps/platform/features/data/regions/regions.hooks.ts:L43-L74'
---

<!-- context:generated:start -->

## Summary

Internationalization system managing user language preference (stored in Redux), locale normalization for CMS requests, and translations via react-i18next. Synchronized across app startup and user preference changes; CMS content falls back to English when locale unavailable.

## Related

- produces [[analytics-tracking]] — Current language tracked in analytics context
- uses [[cms-content-management]] — Locale preference drives CMS loader query parameters and fallback behavior

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
