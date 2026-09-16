---
name: Content Panel Layout and Navigation
slug: content-panel-layout-and-navigation
type: system
sources:
  - path: apps/platform/features/_map/content-panel/ContentHeader.tsx
    hash: 9e2241b23475d2a33783537e9f7c92da59f180500ed5bbd37dd6dea3df02e0e5
  - path: apps/platform/features/_map/content-panel/contentPanel.hooks.ts
    hash: b7d43b49c16706b0910888283fe34a173cf8398812a83fdc6bd013f1646c14de
  - path: apps/platform/features/_map/content-panel/ContentPanel.tsx
    hash: b9bf38abf894e03c1b86294b416ccc1e2f0d8a851357be1f72472e1ef0bc527e
  - path: apps/platform/features/_map/content-panel/EmptyContent.tsx
    hash: 37b5770f294a318dbfef7087f8bb2fddbeb0211af04c729598307c890c65914f
sources_digest: 9c47bc05a19dd3b70f18d10cb69d1d394554e8c5fa981a86e17e4c8e912da0aa
links:
  - to: responsive-ui-patterns
    relation: uses
    description: >-
      Panel expands to 100% width on small screens; dragging width is calculated
      via mouse delta tracking
  - to: router-and-url-state-management
    relation: depends_on
    description: >-
      Panel state (type, ID, subcontentId) is stored in URL query parameters via
      useReplaceQueryParams
generator:
  version: 1
covers:
  - symbol: ContentHeaderProps
    kind: type
    at: 'apps/platform/features/_map/content-panel/ContentHeader.tsx:L10-L12'
  - symbol: ContentHeader
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentHeader.tsx:L14-L29'
  - symbol: clampPanelWidth
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentPanel.tsx:L30-L31'
  - symbol: ContentPanel
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentPanel.tsx:L33-L128'
  - symbol: handleMouseDown
    kind: function
    at: 'apps/platform/features/_map/content-panel/ContentPanel.tsx:L88-L94'
  - symbol: EmptyContent
    kind: function
    at: 'apps/platform/features/_map/content-panel/EmptyContent.tsx:L8-L28'
  - symbol: SidePanelTarget
    kind: type
    at: 'apps/platform/features/_map/content-panel/contentPanel.hooks.ts:L5-L10'
  - symbol: useSidePanel
    kind: function
    at: 'apps/platform/features/_map/content-panel/contentPanel.hooks.ts:L12-L40'
  - symbol: useScrollToTopOnChange
    kind: function
    at: 'apps/platform/features/_map/content-panel/contentPanel.hooks.ts:L42-L48'
---

<!-- context:generated:start -->

## Summary

Resizable side panel container for map contextual content (guides, datasets, terminology, chat) with lazy-loaded components, responsive sizing constraints (320-800px), and URL-based state synchronization for panel type and content ID.

## Related

- uses [[responsive-ui-patterns]] — Panel expands to 100% width on small screens; dragging width is calculated via mouse delta tracking
- depends on [[router-and-url-state-management]] — Panel state (type, ID, subcontentId) is stored in URL query parameters via useReplaceQueryParams

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
