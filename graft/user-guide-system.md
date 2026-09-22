---
name: User Guide System
slug: user-guide-system
type: system
sources:
  - path: apps/platform/features/_map/content-panel/user-guide/TableOfContents.tsx
    hash: 5055daceda665b02e42a577ced9dcdf9aea0d677e5cc0d3c4778ba012904faaa
  - path: apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx
    hash: 3bcaf87523f66f2903e9723547abc8b35fa67e70b382f1e8b906d64bf9e46a54
sources_digest: 675c316394771245c21e8d34954d1c78c14a5557973b395ff52748c87e0418a5
links:
  - to: content-panel-layout-and-navigation
    relation: part_of
    description: >-
      UserGuideContent is a lazy-loaded content variant in ContentPanel,
      triggered by userGuide panel type
  - to: localization-and-resource-keys
    relation: uses
    description: >-
      Fetches locale-aware guide content via useGetUserGuideQuery; converts i18n
      language codes to content locales
  - to: markdown-rendering-and-extensions
    relation: uses
    description: >-
      Renders guide sections via ContentMarkdown; handles relative section links
      via MarkdownLink
generator:
  version: 1
covers:
  - symbol: TableOfContentsSection
    kind: type
    at: >-
      apps/platform/features/_map/content-panel/user-guide/TableOfContents.tsx:L11-L21
  - symbol: TableOfContentsProps
    kind: type
    at: >-
      apps/platform/features/_map/content-panel/user-guide/TableOfContents.tsx:L23-L29
  - symbol: TableOfContents
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/user-guide/TableOfContents.tsx:L31-L138
  - symbol: toggleCollapsed
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/user-guide/TableOfContents.tsx:L42-L52
  - symbol: UserGuideContentComponent
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx:L18-L240
  - symbol: onScroll
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx:L38-L38
  - symbol: performScroll
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx:L66-L73
  - symbol: onImgLoad
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx:L85-L89
---

<!-- context:generated:start -->

## Summary

Localized help documentation browser with hierarchical sections/subsections, full-text search with preview snippets, and bi-directional navigation between guide content and map sections via anchor links. Lazy-loads table of contents and scrolls to subsections on demand.

## Related

- part of [[content-panel-layout-and-navigation]] — UserGuideContent is a lazy-loaded content variant in ContentPanel, triggered by userGuide panel type
- uses [[localization-and-resource-keys]] — Fetches locale-aware guide content via useGetUserGuideQuery; converts i18n language codes to content locales
- uses [[markdown-rendering-and-extensions]] — Renders guide sections via ContentMarkdown; handles relative section links via MarkdownLink

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
