---
name: Port Labeler App
slug: port-labeler-app
type: system
sources:
  - path: apps/port-labeler/src/features/app/app.hooks.ts
    hash: d33162aa36a9a7d475e02e8ea3a02880a537cc65cfd40b7a0fa655db215ca868
  - path: apps/port-labeler/src/features/app/App.tsx
    hash: 571bdba387180768cf9c84fc9af82c370f046b4841a177ff348548240c8b8d93
sources_digest: ba9071500853c28df02ec7770ea4376ed0015b3580c35e80a742f99c601f3aca
links:
  - to: i18n-system
    relation: uses
    description: >-
      App component integrates i18n translations through t() function from
      features/i18n
  - to: labeler-state-management
    relation: depends_on
    description: Dispatches fetchUserThunk on mount via app.hooks typed Redux dispatch
  - to: port-labeler-map-system
    relation: uses
    description: >-
      App renders lazy-loaded Map component that coordinates all map
      interactions
generator:
  version: 1
covers:
  - symbol: Window
    kind: interface
    at: 'apps/port-labeler/src/features/app/App.tsx:L18-L20'
  - symbol: Main
    kind: function
    at: 'apps/port-labeler/src/features/app/App.tsx:L23-L33'
  - symbol: App
    kind: function
    at: 'apps/port-labeler/src/features/app/App.tsx:L35-L71'
  - symbol: useAppDispatch
    kind: function
    at: 'apps/port-labeler/src/features/app/app.hooks.ts:L7-L7'
---

<!-- context:generated:start -->

## Summary

Root application component and core feature modules for the port-labeler standalone tool. Orchestrates sidebar, map interface, authentication (via fetchUserThunk), and lazy-loaded components with split-view layout. Core dependencies include TanStack routing, Redux state management, and interactive map controls.

## Related

- uses [[i18n-system]] — App component integrates i18n translations through t() function from features/i18n
- depends on [[labeler-state-management]] — Dispatches fetchUserThunk on mount via app.hooks typed Redux dispatch
- uses [[port-labeler-map-system]] — App renders lazy-loaded Map component that coordinates all map interactions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
