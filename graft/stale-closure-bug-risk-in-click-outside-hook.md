---
name: Stale Closure Bug Risk in Click-Outside Hook
slug: stale-closure-bug-risk-in-click-outside-hook
type: concept
sources:
  - path: apps/track-labeler/src/features/map/map-controls/mapControls.hooks.ts
    hash: 27c5409eb759727ca7c6b7cb5faf68b20c9f1e9160758753767ba48c154c71fd
sources_digest: e10c54a4dac22726f52fefcdd3ddf0d354df4f36de20a0fb35c9de16d6fbb907
links: []
generator:
  version: 1
covers:
  - symbol: useClickOutside
    kind: function
    at: >-
      apps/track-labeler/src/features/map/map-controls/mapControls.hooks.ts:L3-L23
  - symbol: handleClickOutside
    kind: function
    at: >-
      apps/track-labeler/src/features/map/map-controls/mapControls.hooks.ts:L10-L14
---

<!-- context:generated:start -->

## Summary

The useClickOutside hook in mapControls.hooks.ts registers a document click listener with an empty dependency array, meaning the listener captures the callback function at mount time and never updates. Passing a new callback prop won't take effect until the component remounts, creating a stale-closure bug where clicks may not be recognized if the callback changes (e.g., if a parent re-renders with a new function). This is a known anti-pattern in React hooks; the fix requires including callback in the dependency array.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
