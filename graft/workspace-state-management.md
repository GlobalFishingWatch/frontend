---
name: Workspace State Management
slug: workspace-state-management
type: concept
sources:
  - path: apps/platform/features/layouts/MapLayout.tsx
    hash: e01e7d45c26fb64ff77f6b186770a86d3f43915173a9da0c40ead387fc69dbb0
  - path: apps/platform/features/layouts/MapMainLayout.tsx
    hash: f26a843e332d5fa5f827decedc626c05e779fbb743bdbf498cd9b2af0d1a8013
  - path: apps/platform/features/modals/modals.selectors.ts
    hash: 33ca36bb72095b438c1ee8096e5737a6d74db60c83b1df1cd9fef96cd00c233d
sources_digest: f9e9201ff4a3a4c30a9a5a72adb251134d1f7df9f8d8e01dc5eea7168f81da64
links:
  - to: layout-system
    relation: part_of
    description: >-
      Layout components read workspace state to determine map, sidebar, and
      footer visibility
generator:
  version: 1
covers:
  - symbol: Window
    kind: interface
    at: 'apps/platform/features/layouts/MapLayout.tsx:L43-L45'
  - symbol: MapLayout
    kind: function
    at: 'apps/platform/features/layouts/MapLayout.tsx:L50-L151'
  - symbol: Main
    kind: function
    at: 'apps/platform/features/layouts/MapMainLayout.tsx:L29-L78'
---

<!-- context:generated:start -->

## Summary

Redux-based workspace and dataview state drives layout composition, navigation visibility, and modal display. Key selectors: isWorkspaceReady gates Map render, selectWorkspaceCategory determines fixed sidebar widths, selectScreenshotMode hides non-essential UI for clean captures, selectIsHelpHubLocation switches help-hub styling.

## Related

- part of [[layout-system]] — Layout components read workspace state to determine map, sidebar, and footer visibility

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
