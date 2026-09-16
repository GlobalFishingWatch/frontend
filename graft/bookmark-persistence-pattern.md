---
name: Bookmark Persistence Pattern
slug: bookmark-persistence-pattern
type: system
sources:
  - path: libs/timebar/src/components/bookmark-button.tsx
    hash: 650f79bef4a6d0402c95c7c698a34e19faed7598ac9563ceb0c62a471bc49cf0
  - path: libs/timebar/src/components/bookmark.tsx
    hash: 978fac1cd73b6b354bee7633becdb0a049adab8e4741a9f16c67a8150e4e0aa0
sources_digest: a9703de047215baa6b08b9968ac2256dabc4c5ae9393e95a12d2782f9147363f
links:
  - to: timebar-main-component
    relation: implements
    description: >-
      TimebarBookmarkButton child component uses useTimebar to read current
      range and trigger onBookmarkChange; Bookmark consumes
      bookmarkStart/bookmarkEnd from context
  - to: timeline-context-system
    relation: depends_on
    description: >-
      Bookmark renders on the TimelineScale using d3 scale functions to convert
      UTC dates to pixel coordinates
generator:
  version: 1
covers:
  - symbol: TimebarBookmarkButton
    kind: function
    at: 'libs/timebar/src/components/bookmark-button.tsx:L10-L39'
  - symbol: setBookmark
    kind: function
    at: 'libs/timebar/src/components/bookmark-button.tsx:L23-L25'
  - symbol: BookmarkProps
    kind: type
    at: 'libs/timebar/src/components/bookmark.tsx:L16-L27'
  - symbol: Bookmark
    kind: function
    at: 'libs/timebar/src/components/bookmark.tsx:L29-L99'
---

<!-- context:generated:start -->

## Summary

Bookmark feature for saving and restoring time range selections. TimebarBookmarkButton triggers saves; Bookmark component renders saved ranges on the timeline with overflow-aware positioning and deletion UI. Integrates with Timebar via onBookmarkChange callback and visually indicates when current range matches a saved bookmark.

## Related

- implements [[timebar-main-component]] — TimebarBookmarkButton child component uses useTimebar to read current range and trigger onBookmarkChange; Bookmark consumes bookmarkStart/bookmarkEnd from context
- depends on [[timeline-context-system]] — Bookmark renders on the TimelineScale using d3 scale functions to convert UTC dates to pixel coordinates

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
