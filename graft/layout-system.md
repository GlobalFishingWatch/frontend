---
name: Layout System
slug: layout-system
type: system
sources:
  - path: apps/platform/features/layouts/ContentLayout.tsx
    hash: 60e86383573bd873c547cfa929edf02dd4ab735f481bbc437aef78c2f8efc60b
  - path: apps/platform/features/layouts/MapLayout.tsx
    hash: e01e7d45c26fb64ff77f6b186770a86d3f43915173a9da0c40ead387fc69dbb0
  - path: apps/platform/features/layouts/MapMainLayout.tsx
    hash: f26a843e332d5fa5f827decedc626c05e779fbb743bdbf498cd9b2af0d1a8013
  - path: apps/platform/features/layouts/PlatformLayout.tsx
    hash: 8358f63b56bbc68f4088602688d80f375e0afd0a40f058e1cca5e13d6bd6626a
sources_digest: 2850a44ae71395a457435e8039347a25e7255ab4780688097ba3063d9373488a
links:
  - to: content-resizing-pattern
    relation: uses
    description: >-
      Uses usePersistedPanelWidth hook to manage resizable content panel widths
      persisted to cookies
  - to: map-components
    relation: uses
    description: >-
      Lazily loads Map and Timebar components; gates rendering on workspace
      readiness
  - to: modal-system
    relation: uses
    description: >-
      Integrates AppModals for dialog rendering and manages modal state
      visibility
  - to: navigation-system
    relation: uses
    description: >-
      Renders PlatformNav or LegacyNav based on PLATFORM_MODE flag; manages
      navigation state through redux selectors
  - to: responsive-layout-pattern
    relation: uses
    description: >-
      Conditionally renders UI elements based on screen size via useSmallScreen
      hook
generator:
  version: 1
covers:
  - symbol: ContentLayout
    kind: function
    at: 'apps/platform/features/layouts/ContentLayout.tsx:L27-L62'
  - symbol: Window
    kind: interface
    at: 'apps/platform/features/layouts/MapLayout.tsx:L43-L45'
  - symbol: MapLayout
    kind: function
    at: 'apps/platform/features/layouts/MapLayout.tsx:L50-L151'
  - symbol: Main
    kind: function
    at: 'apps/platform/features/layouts/MapMainLayout.tsx:L29-L78'
  - symbol: PlatformLayout
    kind: function
    at: 'apps/platform/features/layouts/PlatformLayout.tsx:L28-L86'
---

<!-- context:generated:start -->

## Summary

Orchestrates the platform's page layout hierarchy via four main layout components (PlatformLayout, MapMainLayout, MapLayout, ContentLayout) that conditionally render navigation, map, and content areas based on route and workspace state. Maintains critical DOM ID contract (SCROLL_CONTAINER_DOM_ID) that 15+ modules depend on for modals and scroll synchronization.

## Related

- uses [[content-resizing-pattern]] — Uses usePersistedPanelWidth hook to manage resizable content panel widths persisted to cookies
- uses [[map-components]] — Lazily loads Map and Timebar components; gates rendering on workspace readiness
- uses [[modal-system]] — Integrates AppModals for dialog rendering and manages modal state visibility
- uses [[navigation-system]] — Renders PlatformNav or LegacyNav based on PLATFORM_MODE flag; manages navigation state through redux selectors
- uses [[responsive-layout-pattern]] — Conditionally renders UI elements based on screen size via useSmallScreen hook

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
