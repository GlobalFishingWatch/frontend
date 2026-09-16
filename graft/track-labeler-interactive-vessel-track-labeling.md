---
name: 'Track-Labeler: Interactive Vessel Track Labeling'
slug: track-labeler-interactive-vessel-track-labeling
type: system
sources:
  - path: apps/track-labeler/src/app.test.tsx
    hash: c28468606d55fe38913c0cd72542b0333b27c5b2e31e71f9c69df044c35461de
  - path: apps/track-labeler/src/App.tsx
    hash: 3d3fd59ef1eab0fa7747f33cdfe1c2df30ab23d38b55db83ff657cab78383e4f
sources_digest: 6bc262af1fb5c6cd5555f68feef354ee139e739290e4968459cc036cf3b9e112
links:
  - to: track-labeler-configuration-schema
    relation: uses
    description: >-
      App renders Main and Sidebar containers configured via projects and field
      definitions
generator:
  version: 1
covers:
  - symbol: App
    kind: function
    at: 'apps/track-labeler/src/App.tsx:L17-L62'
  - symbol: onToggle
    kind: function
    at: 'apps/track-labeler/src/App.tsx:L21-L23'
---

<!-- context:generated:start -->

## Summary

Standalone track-labeler application for labeling fishing vessel movement data. Renders either Login component or Main/Sidebar two-panel layout depending on authentication status. Lazy-loads main feature modules with Suspense boundaries and Loader placeholder; hardcoded 2-second setTimeout for initialization animation suggests crude timing pattern.

## Related

- uses [[track-labeler-configuration-schema]] — App renders Main and Sidebar containers configured via projects and field definitions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
