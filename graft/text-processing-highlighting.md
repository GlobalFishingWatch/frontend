---
name: Text Processing & Highlighting
slug: text-processing-highlighting
type: system
sources:
  - path: apps/platform/utils/text.tsx
    hash: 6740eedaac26d47639bb5694545b9d785abcdf4396fac469709781f46c3381ec
sources_digest: a1f69806b48b8ccd3c1de126a54f7c0d072ad355e6dfbd321600bf1aecc3eff7
links: []
generator:
  version: 1
covers:
  - symbol: getHighlightedText
    kind: function
    at: 'apps/platform/utils/text.tsx:L3-L36'
  - symbol: regEscape
    kind: function
    at: 'apps/platform/utils/text.tsx:L16-L16'
  - symbol: getSearchPreview
    kind: function
    at: 'apps/platform/utils/text.tsx:L38-L45'
---

<!-- context:generated:start -->

## Summary

React utilities for search-related UI: getHighlightedText wraps matching portions of text in styled spans with case-insensitive matching and deduplication; getSearchPreview generates a 40-char contextual excerpt around the first query occurrence. Both assume external styles object with 'highlighted' class name.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
