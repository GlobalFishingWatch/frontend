---
name: Sidebar Container & Layout
slug: sidebar-container-layout
type: system
sources:
  - path: apps/platform/features/_map/sidebar/sidebar.hooks.ts
    hash: b8ada33e054f66e9b06f07cafc793b90bc70839a57d8bc21a2ff2cfb5688f1f3
  - path: apps/platform/features/_map/sidebar/Sidebar.tsx
    hash: c1e47aeceb9f31a8c4c41c692bc7e9c8fcd057e82bfa69ca0945a8bdaca02fa8
  - path: apps/platform/features/_map/sidebar/sidebar.utils.ts
    hash: b960312f90681a14a970c771a8df669235c94a1d7f62033ced1e0fbfd00fd2b3
  - path: apps/platform/features/_map/sidebar/SidebarHeader.tsx
    hash: 9a0b6371e591c1d1ce2af2278a382ddc89815c465e3915972801b84636711eb1
sources_digest: ba014c78ba188fea1a92b049504f2a7a8519f7b88dc79cf5b30d7204e06fd7d6
links:
  - to: sidebar-state-management
    relation: depends_on
    description: >-
      Sidebar and SidebarHeader read selectDataviewsResources,
      selectScreenshotMode, selectTrackCorrectionOpen, and location selectors to
      control visibility and layout
  - to: track-correction-feature
    relation: uses
    description: >-
      Sidebar lazy-loads TrackCorrection component and conditionally renders it
      as overlay when selectTrackCorrectionOpen is true; uses Suspense to
      prevent bundle bloat
generator:
  version: 1
covers:
  - symbol: SidebarProps
    kind: type
    at: 'apps/platform/features/_map/sidebar/Sidebar.tsx:L24-L26'
  - symbol: Sidebar
    kind: function
    at: 'apps/platform/features/_map/sidebar/Sidebar.tsx:L28-L75'
  - symbol: SidebarHeader
    kind: function
    at: 'apps/platform/features/_map/sidebar/SidebarHeader.tsx:L93-L155'
  - symbol: handleScroll
    kind: function
    at: 'apps/platform/features/_map/sidebar/SidebarHeader.tsx:L110-L113'
  - symbol: useClipboardNotification
    kind: function
    at: 'apps/platform/features/_map/sidebar/sidebar.hooks.ts:L5-L32'
  - symbol: getScrollElement
    kind: function
    at: 'apps/platform/features/_map/sidebar/sidebar.utils.ts:L5-L7'
---

<!-- context:generated:start -->

## Summary

The main sidebar component hierarchy that manages conditional content display (regular children vs. track-correction overlay), header rendering, scroll management, and resource fetching for the left panel of the map interface.

## Related

- depends on [[sidebar-state-management]] — Sidebar and SidebarHeader read selectDataviewsResources, selectScreenshotMode, selectTrackCorrectionOpen, and location selectors to control visibility and layout
- uses [[track-correction-feature]] — Sidebar lazy-loads TrackCorrection component and conditionally renders it as overlay when selectTrackCorrectionOpen is true; uses Suspense to prevent bundle bloat

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
