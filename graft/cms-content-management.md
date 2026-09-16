---
name: CMS Content Management
slug: cms-content-management
type: system
sources:
  - path: apps/platform/features/cms/data-terminology/DataTerminology.tsx
    hash: 3c004a2f3ad3c45ed1d89f2913407a15b85bdb1a5abd2121535f4427bc4754d8
  - path: apps/platform/features/cms/loaders/data-terminology.ts
    hash: 23a27dad08e94645a59cb15bc128c7721dc7110df11254b8d5a53fe791349411
  - path: apps/platform/features/cms/loaders/data-terminology.types.ts
    hash: eb546c84b485713e60a861b1b4e25de16cc5fceabd9bfdbf44d8f3355c64d41d
  - path: apps/platform/features/cms/loaders/data-update.ts
    hash: 2d63740c6db1972c161a213bd59c4c0e5b87ca666572eaa93ab4eb8b2182851f
  - path: apps/platform/features/cms/loaders/data-update.types.ts
    hash: c7f50d302296fbeaf96c20ec5c64766a41182dad0480bbab62b12717749f95ff
  - path: apps/platform/features/cms/loaders/preview.ts
    hash: c5a9ef284e4cd05a6af5078b5096bcb3763bc57a2934cf7fbb4f90237fa0abf9
  - path: apps/platform/features/cms/loaders/use-case.ts
    hash: ea29ff96605a47803231a56a76bf753f6651a7853c8ba0fd05e034726a8c2e0c
  - path: apps/platform/features/cms/loaders/use-case.types.ts
    hash: fbf4183644dd7c4668d73e791266b835945001ee8f5ed0e9902b9d9699fd19d2
  - path: apps/platform/features/cms/loaders/user-guide.ts
    hash: 1292a50506a94353b8202d509feb0fcc0aee0896db1357cad19836c0adb2f67d
  - path: apps/platform/features/cms/loaders/user-guide.types.ts
    hash: 1360a5991fa9345e6ef0667ea45f2eefb8f752e6eda896e27438ae8239a409ea
  - path: apps/platform/features/cms/loaders/utils.ts
    hash: 5ae01cb0ddaf26fd8e44e6f87957aa222f0bf3a6bcb52bdcf51745bb9f114373
  - path: apps/platform/features/cms/strapi-sdk.ts
    hash: f47517a5a332e8c05c6c3fa0e5212c22436ac8c1255dee59eca6dfa8ea333670
  - path: apps/platform/features/cms/strapi.types.ts
    hash: d566c45d33c606a7d18c51dabc23e724ede5b9f33ef8c12e0d67597ca97d5533
sources_digest: 7939b8812deb723bf5eb0e08cd96bad55d1aa0b2eb28e2afcce23bd1995630e6
links:
  - to: analytics-tracking
    relation: uses
    description: >-
      DataTerminology component tracks 'HelpHints' events when users open
      content panels
  - to: i18n-localization
    relation: uses
    description: >-
      Loaders accept optional locale and fetch content in requested language
      with English fallback
generator:
  version: 1
covers:
  - symbol: DataTerminologyProps
    kind: interface
    at: 'apps/platform/features/cms/data-terminology/DataTerminology.tsx:L13-L21'
  - symbol: DataTerminology
    kind: function
    at: 'apps/platform/features/cms/data-terminology/DataTerminology.tsx:L23-L73'
  - symbol: DataTerminologySlugs
    kind: type
    at: 'apps/platform/features/cms/loaders/data-terminology.types.ts:L3-L30'
  - symbol: DataTerminology
    kind: type
    at: 'apps/platform/features/cms/loaders/data-terminology.types.ts:L32-L36'
  - symbol: DataUpdateContent
    kind: type
    at: 'apps/platform/features/cms/loaders/data-update.types.ts:L3-L3'
  - symbol: DataUpdate
    kind: type
    at: 'apps/platform/features/cms/loaders/data-update.types.ts:L5-L11'
  - symbol: CmsRequestMode
    kind: type
    at: 'apps/platform/features/cms/loaders/preview.ts:L1-L5'
  - symbol: isAuthorized
    kind: function
    at: 'apps/platform/features/cms/loaders/preview.ts:L7-L21'
  - symbol: resolveCmsRequestMode
    kind: function
    at: 'apps/platform/features/cms/loaders/preview.ts:L23-L35'
  - symbol: UseCaseSectionSlug
    kind: type
    at: 'apps/platform/features/cms/loaders/use-case.types.ts:L15-L15'
  - symbol: UseCaseRole
    kind: type
    at: 'apps/platform/features/cms/loaders/use-case.types.ts:L17-L17'
  - symbol: UseCaseContent
    kind: type
    at: 'apps/platform/features/cms/loaders/use-case.types.ts:L19-L19'
  - symbol: UseCaseSection
    kind: type
    at: 'apps/platform/features/cms/loaders/use-case.types.ts:L21-L27'
  - symbol: UseCaseSubSection
    kind: type
    at: 'apps/platform/features/cms/loaders/use-case.types.ts:L29-L33'
  - symbol: UserGuideSectionSlug
    kind: type
    at: 'apps/platform/features/cms/loaders/user-guide.types.ts:L61-L61'
  - symbol: SubSectionArrays
    kind: type
    at: 'apps/platform/features/cms/loaders/user-guide.types.ts:L63-L63'
  - symbol: UserGuideSubSectionSlug
    kind: type
    at: 'apps/platform/features/cms/loaders/user-guide.types.ts:L64-L64'
  - symbol: UserGuideSlug
    kind: type
    at: 'apps/platform/features/cms/loaders/user-guide.types.ts:L66-L66'
  - symbol: UserGuideContent
    kind: type
    at: 'apps/platform/features/cms/loaders/user-guide.types.ts:L68-L68'
  - symbol: UserGuideSection
    kind: type
    at: 'apps/platform/features/cms/loaders/user-guide.types.ts:L70-L76'
  - symbol: UserGuideSubSection
    kind: type
    at: 'apps/platform/features/cms/loaders/user-guide.types.ts:L78-L82'
  - symbol: StrapiCollection
    kind: type
    at: 'apps/platform/features/cms/loaders/utils.ts:L13-L13'
  - symbol: FindParams
    kind: type
    at: 'apps/platform/features/cms/loaders/utils.ts:L14-L14'
  - symbol: StrapiCollectionName
    kind: type
    at: 'apps/platform/features/cms/loaders/utils.ts:L16-L23'
  - symbol: FetchStrapiCollectionParams
    kind: type
    at: 'apps/platform/features/cms/loaders/utils.ts:L25-L29'
  - symbol: fetchStrapiCollection
    kind: function
    at: 'apps/platform/features/cms/loaders/utils.ts:L31-L57'
  - symbol: getCmsRequestMode
    kind: function
    at: 'apps/platform/features/cms/loaders/utils.ts:L68-L78'
  - symbol: fetchStrapiCollectionCached
    kind: function
    at: 'apps/platform/features/cms/loaders/utils.ts:L80-L88'
  - symbol: StrapiResponse
    kind: type
    at: 'apps/platform/features/cms/strapi.types.ts:L1-L7'
  - symbol: StrapiBaseAttributes
    kind: type
    at: 'apps/platform/features/cms/strapi.types.ts:L9-L17'
  - symbol: StrapiImage
    kind: type
    at: 'apps/platform/features/cms/strapi.types.ts:L19-L24'
  - symbol: StrapiPagination
    kind: type
    at: 'apps/platform/features/cms/strapi.types.ts:L25-L30'
  - symbol: StrapiError
    kind: type
    at: 'apps/platform/features/cms/strapi.types.ts:L32-L37'
---

<!-- context:generated:start -->

## Summary

Strapi headless CMS integration providing cached server functions for fetching multi-variant content: data terminology, data updates, user guides, and use cases. Supports draft/preview mode with secret authorization, locale-aware fallback to English, and SWR caching with Nitro. Client-side components open content in side panels with tracking.

## Related

- uses [[analytics-tracking]] — DataTerminology component tracks 'HelpHints' events when users open content panels
- uses [[i18n-localization]] — Loaders accept optional locale and fetch content in requested language with English fallback

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
