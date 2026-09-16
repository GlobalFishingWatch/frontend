---
name: Localization and Resource Keys
slug: localization-and-resource-keys
type: concept
sources:
  - path: apps/platform/data/map/layer-library/layers.types.ts
    hash: 9d1ff027e37822fc1ce655747942815151a684bcbfcc31838230ab4c5c4e5219
  - path: apps/platform/features/_map/bigquery/bigquery.config.ts
    hash: 7927083be1676d9816336eb5e363aad1feb9fe6484bb971102b54c39c3d130b6
  - path: apps/platform/features/_map/content-panel/chat/ChatContainer.tsx
    hash: 159cfd9c2b258d6bff4fe06a351b6fdae78eef3259f11af03c7e6cb8184115d9
  - path: >-
      apps/platform/features/_map/content-panel/data-terminology/DataTerminologyContent.tsx
    hash: 6b8c6d03fad121bb9948f2c85b1040173751b1dd9c9e92d249fe1999029ed671
  - path: apps/platform/features/_map/content-panel/MarkdownLink.tsx
    hash: b7b6d2382e048a06c37412e974f754dfe2d06b961949c47bced0576786752691
  - path: apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx
    hash: 3bcaf87523f66f2903e9723547abc8b35fa67e70b382f1e8b906d64bf9e46a54
sources_digest: 49911634df8dcf6dad4cf5425ebadf4eae4fe9e9fc53e3b3a017bc3b647dbc63
links:
  - to: layer-library-system
    relation: implements
    description: >-
      LayerLibraryId type is branded on AppResources keys to maintain i18n
      synchronization
generator:
  version: 1
covers:
  - symbol: LayerLibraryId
    kind: type
    at: 'apps/platform/data/map/layer-library/layers.types.ts:L14-L14'
  - symbol: LibraryLayerConfig
    kind: type
    at: 'apps/platform/data/map/layer-library/layers.types.ts:L15-L20'
  - symbol: LibraryLayer
    kind: type
    at: 'apps/platform/data/map/layer-library/layers.types.ts:L22-L27'
  - symbol: MarkdownLinkProps
    kind: type
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L9-L9'
  - symbol: MarkdownLink
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L11-L78'
  - symbol: handleClick
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L59-L71'
  - symbol: ChatContainer
    kind: function
    at: 'apps/platform/features/_map/content-panel/chat/ChatContainer.tsx:L11-L37'
  - symbol: DataTerminologyContent
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/data-terminology/DataTerminologyContent.tsx:L16-L50
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

Multi-language support via i18next and branded string types (AppResources keys) that guarantee label/key synchronization at compile time. Content locales are derived from i18n language codes via toContentLocale mapping; translations are injected at export time for static config and render time for dynamic UI.

## Related

- implements [[layer-library-system]] — LayerLibraryId type is branded on AppResources keys to maintain i18n synchronization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
