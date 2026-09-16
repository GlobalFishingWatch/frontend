---
name: Shared Utilities
slug: shared-utilities
type: system
sources:
  - path: apps/track-labeler/src/index.tsx
    hash: f4f2a128305a30d5ee77d6ca9aca636c902328686039b10f5396ce8fa1193ac1
  - path: apps/track-labeler/src/setupTests.ts
    hash: b4fbf1982443c640d761d82b98f02e104be222689664a522a5e1c4ba1854e324
  - path: apps/track-labeler/src/utils/shared.ts
    hash: cfa61d21d865b150037dd6997953fbd981d2d7a06f4385da5054232f9b0c385d
sources_digest: 1df61cdbe3ca3b5c8557f4c74f52d51dfaaad7843530c727733acb9c0ed76033
links:
  - to: track-labeler-vessel-metadata
    relation: uses
    description: >-
      Shared utilities navigate through TrackInterface objects using timestamp
      indices; selectors filter by timestamps
  - to: track-selection-and-undo
    relation: uses
    description: >-
      Temporal navigation utilities support segment selection workflows that
      depend on coordinate/timestamp lookups
generator:
  version: 1
covers:
  - symbol: typedKeys
    kind: function
    at: 'apps/track-labeler/src/utils/shared.ts:L6-L9'
  - symbol: isFiniteBbox
    kind: function
    at: 'apps/track-labeler/src/utils/shared.ts:L11-L13'
  - symbol: formatedDate
    kind: function
    at: 'apps/track-labeler/src/utils/shared.ts:L15-L22'
  - symbol: findPreviousTimestamp
    kind: function
    at: 'apps/track-labeler/src/utils/shared.ts:L23-L34'
  - symbol: findNextTimestamp
    kind: function
    at: 'apps/track-labeler/src/utils/shared.ts:L36-L46'
  - symbol: findPreviousPosition
    kind: function
    at: 'apps/track-labeler/src/utils/shared.ts:L48-L57'
  - symbol: findNextPosition
    kind: function
    at: 'apps/track-labeler/src/utils/shared.ts:L59-L68'
---

<!-- context:generated:start -->

## Summary

Helper functions for temporal navigation (findNextTimestamp, findPreviousPosition), coordinate validation (isFiniteBbox), date formatting, and object key extraction with TypeScript typing.

## Related

- uses [[track-labeler-vessel-metadata]] — Shared utilities navigate through TrackInterface objects using timestamp indices; selectors filter by timestamps
- uses [[track-selection-and-undo]] — Temporal navigation utilities support segment selection workflows that depend on coordinate/timestamp lookups

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
