---
name: Router and URL State Management
slug: router-and-url-state-management
type: concept
sources:
  - path: apps/platform/features/_map/content-panel/contentPanel.hooks.ts
    hash: b7d43b49c16706b0910888283fe34a173cf8398812a83fdc6bd013f1646c14de
  - path: apps/platform/features/_map/content-panel/ContentPanel.tsx
    hash: b9bf38abf894e03c1b86294b416ccc1e2f0d8a851357be1f72472e1ef0bc527e
  - path: >-
      apps/platform/features/_map/content-panel/data-terminology/DataTerminologyContent.tsx
    hash: 6b8c6d03fad121bb9948f2c85b1040173751b1dd9c9e92d249fe1999029ed671
  - path: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx
    hash: 265ed5719848d8e41e5a1d7b82c8d0ecefb388a15e65febb56bb160f450c44af
  - path: apps/platform/features/_map/content-panel/MarkdownLink.tsx
    hash: b7b6d2382e048a06c37412e974f754dfe2d06b961949c47bced0576786752691
  - path: apps/platform/features/_map/content-panel/user-guide/UserGuideContent.tsx
    hash: 3bcaf87523f66f2903e9723547abc8b35fa67e70b382f1e8b906d64bf9e46a54
sources_digest: c588ddbededb2786239153222c67e451c148cb6d28656b5017a860b11e0c07dc
links:
  - to: ai-chat-session-management
    relation: uses
    description: >-
      Router navigation triggers map state updates via useNavigateToolMapState
      in navigate-tool
  - to: content-panel-layout-and-navigation
    relation: implements
    description: >-
      ContentPanel and useSidePanel manage panel visibility/content via URL
      query parameters
generator:
  version: 1
covers:
  - symbol: clampPanelWidth
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentPanel.tsx:L30-L31'
  - symbol: ContentPanel
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentPanel.tsx:L33-L128'
  - symbol: handleMouseDown
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentPanel.tsx:L88-L94'
  - symbol: MarkdownLinkProps
    kind: type
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L9-L9'
  - symbol: MarkdownLink
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L11-L78'
  - symbol: handleClick
    kind: function
    at: 'apps/platform/features/_map/content-panel/MarkdownLink.tsx:L59-L71'
  - symbol: SidePanelTarget
    kind: type
    at: 'apps/platform/features/_map/content-panel/contentPanel.hooks.ts:L5-L10'
  - symbol: useSidePanel
    kind: function
    at: 'apps/platform/features/_map/content-panel/contentPanel.hooks.ts:L12-L40'
  - symbol: useScrollToTopOnChange
    kind: function
    at: 'apps/platform/features/_map/content-panel/contentPanel.hooks.ts:L42-L48'
  - symbol: DataTerminologyContent
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/data-terminology/DataTerminologyContent.tsx:L16-L50
  - symbol: DatasetInfoContainer
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L35-L146
  - symbol: updateSubsectionId
    kind: function
    at: >-
      apps/platform/features/_map/content-panel/datasets-info/DatasetInfoContainer.tsx:L110-L113
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

URL query parameters serve as source of truth for UI state (panel type, content IDs, search queries) via useAppSearch and useReplaceQueryParams hooks. Enables deep linking, browser history, and bidirectional state sync between router and component state. Content panel state (panel type, ID, subcontentId) is persisted in URL.

## Related

- uses [[ai-chat-session-management]] — Router navigation triggers map state updates via useNavigateToolMapState in navigate-tool
- implements [[content-panel-layout-and-navigation]] — ContentPanel and useSidePanel manage panel visibility/content via URL query parameters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
