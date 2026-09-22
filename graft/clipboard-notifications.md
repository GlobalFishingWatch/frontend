---
name: Clipboard & Notifications
slug: clipboard-notifications
type: concept
sources:
  - path: apps/platform/features/_map/sidebar/buttons/SaveReportButton.tsx
    hash: 671518c5e4ed97ab742b6250fd9cde8ff88569f1c008b3b43779923b76c3392f
  - path: apps/platform/features/_map/sidebar/buttons/ShareWorkspaceButton.tsx
    hash: ddd12dcabf113e98e54d3744fc820177106dc34358d64dc4e6df1592e7341bc9
  - path: apps/platform/features/_map/sidebar/sidebar.hooks.ts
    hash: b8ada33e054f66e9b06f07cafc793b90bc70839a57d8bc21a2ff2cfb5688f1f3
sources_digest: ec18674ebd063183fd0683e781a3528b459f76a0fa63ee44b611cd7433025c53
links:
  - to: map-sidebar-navigation-buttons
    relation: uses
    description: >-
      ShareWorkspaceButton and SaveReportButton use useClipboardNotification to
      copy URLs and toggle icon feedback
  - to: sidebar-container-layout
    relation: uses
    description: >-
      useClipboardNotification hook is exported from sidebar.hooks and wraps
      copyToClipboard utility with timeout-based state management
generator:
  version: 1
covers:
  - symbol: SaveReportButton
    kind: function
    at: 'apps/platform/features/_map/sidebar/buttons/SaveReportButton.tsx:L23-L100'
  - symbol: onSaveClick
    kind: function
    at: 'apps/platform/features/_map/sidebar/buttons/SaveReportButton.tsx:L55-L59'
  - symbol: ShareWorkspaceButton
    kind: function
    at: >-
      apps/platform/features/_map/sidebar/buttons/ShareWorkspaceButton.tsx:L13-L64
  - symbol: useClipboardNotification
    kind: function
    at: 'apps/platform/features/_map/sidebar/sidebar.hooks.ts:L5-L32'
---

<!-- context:generated:start -->

## Summary

A UI pattern for copying URLs to clipboard and displaying transient success notifications with automatic dismissal. The pattern uses a hook-based state machine that shows a 'tick' icon during the feedback window and reverts to the default 'share' icon.

## Related

- uses [[map-sidebar-navigation-buttons]] — ShareWorkspaceButton and SaveReportButton use useClipboardNotification to copy URLs and toggle icon feedback
- uses [[sidebar-container-layout]] — useClipboardNotification hook is exported from sidebar.hooks and wraps copyToClipboard utility with timeout-based state management

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
