---
name: Help Hub System
slug: help-hub-system
type: system
sources:
  - path: apps/platform/features/help/helpHub.config.ts
    hash: bbd36b3b9ae2f7ae6633de9aad9454e3d980f6007edbe7d6d28124eca3f8a5bd
  - path: apps/platform/features/help/helpHub.i18n.ts
    hash: 2e1091a34a8aa2536e96c908e02769b374251dcad3776950ea4ecdcf7694c8fb
  - path: apps/platform/features/help/helpHub.loaders.ts
    hash: 2f4349f2f6b89b25c27b8db0596ef5c3a670ba3856e181e9aecca1f054244a28
  - path: apps/platform/features/help/helpHub.types.ts
    hash: b20cf0179025ff2f8e07905f136369ad6bb8d6c818b1634fe2dddefc9c9778cc
  - path: apps/platform/features/help/helpHub.utils.ts
    hash: 714a48a5f5e48d8eedec9f95b4d14fddc2c9e7acf1cd05d8c83d1d11d940f417
  - path: apps/platform/features/help/HelpHubBreadcrumb.tsx
    hash: 3e828bdfa21b69c235c01acbfd04079d67a68d55a070104e1ce33e5dbc2f0081
  - path: apps/platform/features/help/HelpHubError.tsx
    hash: 9fea8c62a56864bdbc07d518e591a8b8225d9814d89d82b9727a5932e5438a66
  - path: apps/platform/features/help/HelpHubItemContent.tsx
    hash: 0055216aa43293fabcfc6e16ceab8c43cd7bc3df49a4a642273416926cc8e0c0
  - path: apps/platform/features/help/HelpHubLandingPage.tsx
    hash: dcd28af310516ee5ec802886316f5146045c921c093249d968a2b33efd4587ac
  - path: apps/platform/features/help/HelpHubSectionPage.tsx
    hash: bc6d42c325b56164ae8c20fad4a753c86793b6545f5edc848f3a53e5044e2775
sources_digest: 67b5fb011c728798e107a8ff2c3ce984fb529984486eef37266c9b5d852f1c9b
links:
  - to: cms-strapi
    relation: depends_on
    description: >-
      Fetches content from three CMS section loaders (getUserGuideContent,
      getUseCaseContent, getDataUpdateContent) and transforms via Strapi types
      and image extraction utilities
  - to: internationalization
    relation: uses
    description: >-
      Integrates i18n for section titles, descriptions, and locale-aware content
      routing via getActiveI18nLanguage and toContentLocale
generator:
  version: 1
covers:
  - symbol: BreadcrumbItem
    kind: type
    at: 'apps/platform/features/help/HelpHubBreadcrumb.tsx:L16-L20'
  - symbol: HelpHubBreadcrumb
    kind: function
    at: 'apps/platform/features/help/HelpHubBreadcrumb.tsx:L22-L68'
  - symbol: HelpHubError
    kind: function
    at: 'apps/platform/features/help/HelpHubError.tsx:L7-L15'
  - symbol: HelpHubItemContentProps
    kind: type
    at: 'apps/platform/features/help/HelpHubItemContent.tsx:L8-L10'
  - symbol: HelpHubItemContent
    kind: function
    at: 'apps/platform/features/help/HelpHubItemContent.tsx:L12-L37'
  - symbol: HelpHubLandingPage
    kind: function
    at: 'apps/platform/features/help/HelpHubLandingPage.tsx:L20-L74'
  - symbol: HelpHubSectionPage
    kind: function
    at: 'apps/platform/features/help/HelpHubSectionPage.tsx:L16-L93'
  - symbol: getHelpHubSectionCopy
    kind: function
    at: 'apps/platform/features/help/helpHub.i18n.ts:L4-L12'
  - symbol: HelpHubSectionData
    kind: type
    at: 'apps/platform/features/help/helpHub.loaders.ts:L13-L16'
  - symbol: HelpHubSectionItems
    kind: type
    at: 'apps/platform/features/help/helpHub.loaders.ts:L18-L18'
  - symbol: HelpHubFetchOptions
    kind: type
    at: 'apps/platform/features/help/helpHub.loaders.ts:L20-L20'
  - symbol: HelpHubArticleData
    kind: type
    at: 'apps/platform/features/help/helpHub.loaders.ts:L22-L26'
  - symbol: toErrorMessage
    kind: function
    at: 'apps/platform/features/help/helpHub.loaders.ts:L46-L54'
  - symbol: getHelpHubLocale
    kind: function
    at: 'apps/platform/features/help/helpHub.loaders.ts:L56-L58'
  - symbol: loadHelpHubSection
    kind: function
    at: 'apps/platform/features/help/helpHub.loaders.ts:L67-L79'
  - symbol: loadHelpHubSections
    kind: function
    at: 'apps/platform/features/help/helpHub.loaders.ts:L81-L89'
  - symbol: loadHelpHubArticle
    kind: function
    at: 'apps/platform/features/help/helpHub.loaders.ts:L91-L105'
  - symbol: HelpHubSection
    kind: type
    at: 'apps/platform/features/help/helpHub.types.ts:L4-L4'
  - symbol: HelpHubSectionId
    kind: type
    at: 'apps/platform/features/help/helpHub.types.ts:L5-L5'
  - symbol: HelpHubSectionSlug
    kind: type
    at: 'apps/platform/features/help/helpHub.types.ts:L6-L6'
  - symbol: HelpHubItemSubsection
    kind: type
    at: 'apps/platform/features/help/helpHub.types.ts:L8-L13'
  - symbol: HelpHubItem
    kind: type
    at: 'apps/platform/features/help/helpHub.types.ts:L15-L24'
  - symbol: findHelpHubSection
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L14-L19'
  - symbol: toSubsections
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L21-L33'
  - symbol: toUserGuideItems
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L35-L44'
  - symbol: toUseCaseItems
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L46-L55'
  - symbol: toDataUpdateItems
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L57-L66'
  - symbol: getFirstBodyImage
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L75-L84'
  - symbol: CardBodies
    kind: type
    at: 'apps/platform/features/help/helpHub.utils.ts:L86-L86'
  - symbol: toCardItem
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L88-L101'
  - symbol: toCardResponse
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L103-L106'
  - symbol: getCardImage
    kind: function
    at: 'apps/platform/features/help/helpHub.utils.ts:L109-L122'
---

<!-- context:generated:start -->

## Summary

Multi-section content management system for platform help documentation and user guides, fetching content from three distinct CMS sources (tools, use cases, platform updates) with localization, caching, and fallback error handling. Server-side loaders parallelize fetches and cache with 5-minute TTL.

## Related

- depends on [[cms-strapi]] — Fetches content from three CMS section loaders (getUserGuideContent, getUseCaseContent, getDataUpdateContent) and transforms via Strapi types and image extraction utilities
- uses [[internationalization]] — Integrates i18n for section titles, descriptions, and locale-aware content routing via getActiveI18nLanguage and toContentLocale

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
