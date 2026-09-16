---
name: Welcome Modal Content
slug: welcome-modal-content
type: system
sources:
  - path: apps/platform/features/welcome/welcome.content.ts
    hash: cde584489a2f00b425def40ce49addcc803655b95798780289cfff923f862a0d
  - path: apps/platform/features/welcome/Welcome.tsx
    hash: f31945eeaffd199e9f5ba4da506d7778674c0d46f8fc61032ac7e77cbec2c581
sources_digest: df56beb596465eca177894130b6bb92582f0c9700e7cad8d30c84a70ff2fdcc6
links:
  - to: modal-system
    relation: part_of
    description: >-
      Welcome modals are rendered by the Modal System based on workspace and
      route context
  - to: translation-localization
    relation: depends_on
    description: >-
      Content keyed by WelcomeContentKey; Welcome component provides locale
      context for language-specific fallbacks
generator:
  version: 1
covers:
  - symbol: WelcomeProps
    kind: type
    at: 'apps/platform/features/welcome/Welcome.tsx:L25-L27'
  - symbol: WelcomeLocalStorageKey
    kind: type
    at: 'apps/platform/features/welcome/Welcome.tsx:L29-L29'
  - symbol: Welcome
    kind: function
    at: 'apps/platform/features/welcome/Welcome.tsx:L31-L120'
  - symbol: WelcomeContentLang
    kind: type
    at: 'apps/platform/features/welcome/welcome.content.ts:L4-L9'
  - symbol: WelcomeContent
    kind: type
    at: 'apps/platform/features/welcome/welcome.content.ts:L10-L14'
  - symbol: WelcomeContentKey
    kind: type
    at: 'apps/platform/features/welcome/welcome.content.ts:L16-L16'
---

<!-- context:generated:start -->

## Summary

Defines multilingual welcome popup content keyed by context (vessel-profile, deep-sea-mining) with localized titles, HTML descriptions, and optional partner branding. Supports version-based content refresh and localStorage-persisted visibility preferences.

## Related

- part of [[modal-system]] — Welcome modals are rendered by the Modal System based on workspace and route context
- depends on [[translation-localization]] — Content keyed by WelcomeContentKey; Welcome component provides locale context for language-specific fallbacks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
