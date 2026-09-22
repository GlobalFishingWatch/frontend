---
name: Memoization and performance optimization
slug: memoization-and-performance-optimization
type: concept
sources:
  - path: libs/ui-components/src/solar-status/SolarStatus.tsx
    hash: 57411b8a5fb757a8a2dde7957663ba17fcdc525e262d516baf848f133ec8c5ef
  - path: libs/ui-components/src/split-view/SplitView.tsx
    hash: 78e07ceb2d9c59b194dec43ccbf50effcb114a45444784e4ba623e9b2b268693
  - path: libs/ui-components/src/tag-list/TagList.tsx
    hash: e74d464970e942ff9cef4d5106514551d09613190a7c3062b74fd0b6414b4c36
sources_digest: 6c22ae76033c7bb0aa6266307c5fd937f5ab65ec5dba2bc6305be4385cdaa6eb
links: []
generator:
  version: 1
covers:
  - symbol: SolarStatusProps
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L12-L21'
  - symbol: SolarPhase
    kind: interface
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L23-L26'
  - symbol: SolarStatus
    kind: function
    at: 'libs/ui-components/src/solar-status/SolarStatus.tsx:L61-L118'
  - symbol: clampAsidePct
    kind: function
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L18-L18'
  - symbol: SplitViewProps
    kind: interface
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L20-L37'
  - symbol: SplitView
    kind: function
    at: 'libs/ui-components/src/split-view/SplitView.tsx:L39-L183'
  - symbol: TagListProps
    kind: interface
    at: 'libs/ui-components/src/tag-list/TagList.tsx:L10-L16'
  - symbol: TagList
    kind: function
    at: 'libs/ui-components/src/tag-list/TagList.tsx:L18-L47'
---

<!-- context:generated:start -->

## Summary

Deliberate use of useMemo (SolarStatus for phase calculation, SplitView for state updates) and useCallback (TagList for onRemoveTag handler) to prevent unnecessary recalculations and re-renders. SolarStatus memoizes based on lat/lon/timestamp dependencies; TagList memoizes handler to enable parent-child state coordination. Pattern indicates performance sensitivity in components subject to frequent prop changes or frequent parent re-renders.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
