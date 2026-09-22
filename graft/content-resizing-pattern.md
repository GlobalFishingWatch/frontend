---
name: Content Resizing Pattern
slug: content-resizing-pattern
type: concept
sources:
  - path: apps/platform/hooks/cookies.hooks.ts
    hash: 57bfaaecae5d3f287fbf7167f53d0421074d8a3b228dd22d0a2a5a25810929d6
sources_digest: 84806994f0736084779a232b368169d8fd7ad928a267e90b247f9ca58c0b17ea
links:
  - to: layout-system
    relation: uses
    description: >-
      MapLayout and ContentLayout use this hook to persist sidebar and content
      panel widths
generator:
  version: 1
covers:
  - symbol: usePersistedPanelWidth
    kind: function
    at: 'apps/platform/hooks/cookies.hooks.ts:L7-L17'
---

<!-- context:generated:start -->

## Summary

Persists individual panel width preferences to browser cookies via usePersistedPanelWidth hook, which implements read-modify-write to prevent race conditions on concurrent updates to different panel fields. Prevents accidental width loss when multiple panels update simultaneously.

## Related

- uses [[layout-system]] — MapLayout and ContentLayout use this hook to persist sidebar and content panel widths

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
