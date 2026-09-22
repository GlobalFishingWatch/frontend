---
name: User Guide Integration
slug: user-guide-integration
type: system
sources:
  - path: apps/platform/features/help/userGuide.utils.ts
    hash: fd61cd6089583ced795a6e4621eb17a2d65f685179fe2b4448f648cb84df4585
  - path: apps/platform/features/help/UserGuideLink.tsx
    hash: 85bfdd9f8d1c7ea02f3720b3685fe5d6819434b3c28a76cc36bee5f528da7a91
sources_digest: cbd9eab4902f84cd86f14e0d43d9ddcd5e661b94850bf60918576d5a649a9215
links:
  - to: analytics
    relation: uses
    description: >-
      Tracks user guide access by language and section via trackEvent from
      analytics.hooks
  - to: cms-strapi
    relation: depends_on
    description: >-
      Depends on CATEGORIES_CONFIG from features/cms/loaders/user-guide.types
      for hierarchical guide structure
  - to: content-panel-system
    relation: uses
    description: >-
      UserGuideLink uses useSidePanel hook to open user guide side panel with
      resolved section and subsection coordinates
  - to: internationalization
    relation: uses
    description: >-
      Translates section labels and checks i18n.exists for multilingual coverage
      before rendering subsection names
generator:
  version: 1
covers:
  - symbol: UserGuideLinkMode
    kind: type
    at: 'apps/platform/features/help/UserGuideLink.tsx:L14-L14'
  - symbol: UserGuideLinkProps
    kind: type
    at: 'apps/platform/features/help/UserGuideLink.tsx:L16-L22'
  - symbol: UserGuideLink
    kind: function
    at: 'apps/platform/features/help/UserGuideLink.tsx:L24-L73'
  - symbol: handleClick
    kind: function
    at: 'apps/platform/features/help/UserGuideLink.tsx:L40-L52'
  - symbol: findSectionForSlug
    kind: function
    at: 'apps/platform/features/help/userGuide.utils.ts:L8-L27'
---

<!-- context:generated:start -->

## Summary

Lightweight utilities and component wrappers that surface user guide documentation as contextual help triggers throughout the platform UI, linking specific platform sections to hierarchical guide locations via slug mapping.

## Related

- uses [[analytics]] — Tracks user guide access by language and section via trackEvent from analytics.hooks
- depends on [[cms-strapi]] — Depends on CATEGORIES_CONFIG from features/cms/loaders/user-guide.types for hierarchical guide structure
- uses [[content-panel-system]] — UserGuideLink uses useSidePanel hook to open user guide side panel with resolved section and subsection coordinates
- uses [[internationalization]] — Translates section labels and checks i18n.exists for multilingual coverage before rendering subsection names

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
