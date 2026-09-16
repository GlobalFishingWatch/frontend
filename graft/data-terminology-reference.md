---
name: Data Terminology Reference
slug: data-terminology-reference
type: system
sources:
  - path: >-
      apps/platform/features/_map/content-panel/data-terminology/DataTerminologyContent.tsx
    hash: 6b8c6d03fad121bb9948f2c85b1040173751b1dd9c9e92d249fe1999029ed671
sources_digest: 64804ec9755c5be3057d2fb8a623070f927860e867d670113d4525447ea17c7f
links:
  - to: content-panel-layout-and-navigation
    relation: part_of
    description: >-
      DataTerminologyContent is a lazy-loaded content variant in ContentPanel,
      triggered by dataTerminology panel type
  - to: localization-and-resource-keys
    relation: uses
    description: >-
      Fetches terminology in user's preferred locale via toContentLocale;
      attempts vessel-specific translations first
  - to: markdown-rendering-and-extensions
    relation: uses
    description: Renders terminology descriptions via ContentMarkdown
generator:
  version: 1
covers:
  - symbol: DataTerminologyContent
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/data-terminology/DataTerminologyContent.tsx:L16-L50
---

<!-- context:generated:start -->

## Summary

Localized reference panel for explaining data terms and concepts within the map context, fetching terminology definitions by ID and rendering them as markdown content with vessel-specific translation fallback.

## Related

- part of [[content-panel-layout-and-navigation]] — DataTerminologyContent is a lazy-loaded content variant in ContentPanel, triggered by dataTerminology panel type
- uses [[localization-and-resource-keys]] — Fetches terminology in user's preferred locale via toContentLocale; attempts vessel-specific translations first
- uses [[markdown-rendering-and-extensions]] — Renders terminology descriptions via ContentMarkdown

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
