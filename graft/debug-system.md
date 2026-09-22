---
name: Debug System
slug: debug-system
type: system
sources:
  - path: apps/platform/features/debug/DebugMenu.tsx
    hash: bbd949749095fc2d1f91837388d8ec93be9ae3a862985e91650e3a3064657f74
  - path: apps/platform/features/debug/DebugTestingTools.tsx
    hash: b4a31c7f2a735d5191c861f8cc1bd5d013006db74cffcbf9dd29531dc3c25fad
sources_digest: cdf6b4e8628b1bd7eeb694447f9ea28ff6ba5dd5c103a58addf6e76c32500880
links:
  - to: redux-state-management
    relation: uses
    description: >-
      Accesses Redux store via useStore hook and selectors like selectIsGFWUser
      to gate staff-only tabs and export state for debugging
  - to: shared-ui-components
    relation: uses
    description: >-
      Renders tabbed interface and debug panel buttons using
      @globalfishingwatch/ui-components library
generator:
  version: 1
covers:
  - symbol: DebugTabId
    kind: type
    at: 'apps/platform/features/debug/DebugMenu.tsx:L13-L13'
  - symbol: DebugMenu
    kind: function
    at: 'apps/platform/features/debug/DebugMenu.tsx:L15-L43'
  - symbol: sortObjectKeysDeep
    kind: function
    at: 'apps/platform/features/debug/DebugTestingTools.tsx:L12-L34'
  - symbol: DebugTestingTools
    kind: function
    at: 'apps/platform/features/debug/DebugTestingTools.tsx:L36-L84'
  - symbol: getStringifyState
    kind: function
    at: 'apps/platform/features/debug/DebugTestingTools.tsx:L39-L52'
---

<!-- context:generated:start -->

## Summary

Internal debugging and development tools for Global Fishing Watch staff, providing tabbed access to feature flags, Redux state inspection, and testing utilities. Access is gated by staff-only Redux selector; state export includes options to reset or preserve location for reproducible test scenarios.

## Related

- uses [[redux-state-management]] — Accesses Redux store via useStore hook and selectors like selectIsGFWUser to gate staff-only tabs and export state for debugging
- uses [[shared-ui-components]] — Renders tabbed interface and debug panel buttons using @globalfishingwatch/ui-components library

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
