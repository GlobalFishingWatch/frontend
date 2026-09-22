---
name: Browser Polyfills
slug: browser-polyfills
type: system
sources:
  - path: apps/platform/utils/polyfills.ts
    hash: 79c7848a63d2ac17987e5e74ee6e0aac27d8cc77243c35430f6e6e6419528214
sources_digest: c95b1206513a75443a76ad8aa7d0e8726f898383945e0fd2cc243d8dbbdd5498
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Conservative polyfill registration for older/non-standard browser environments: defines HTMLEmbedElement and HTMLObjectElement (missing from Mobile Safari) as HTMLElement subclasses for snapdom compatibility, and implements Array.prototype methods toSorted, findLast, findLastIndex via backward iteration. Each polyfill conditionally registers only if missing.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
