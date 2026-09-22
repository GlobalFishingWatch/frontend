---
name: Hint Dismissal & Persistence
slug: hint-dismissal-persistence
type: concept
sources:
  - path: apps/platform/features/hints/hints.slice.ts
    hash: a464a7ea621f8019379143fa1429b6def271cedc4ac5907e92109014e69f1db2
sources_digest: d234877793a8591594e11031233d56c89f6cea8badf6781a5081244a6bc9e451
links:
  - to: hints-contextual-help
    relation: part_of
    description: >-
      Ensures user hint dismissal preferences persist across sessions via
      localStorage sync on each setHintDismissed action
generator:
  version: 1
covers:
  - symbol: HintsDismissed
    kind: type
    at: 'apps/platform/features/hints/hints.slice.ts:L10-L10'
  - symbol: HintsState
    kind: interface
    at: 'apps/platform/features/hints/hints.slice.ts:L12-L14'
  - symbol: selectHintsDismissed
    kind: function
    at: 'apps/platform/features/hints/hints.slice.ts:L50-L50'
---

<!-- context:generated:start -->

## Summary

Redux + localStorage dual-write pattern where hint dismissals are both stored in Redux state and immediately persisted to localStorage under HINTS key, enabling dismissal state to survive browser refreshes while remaining synchronized with in-memory Redux store.

## Related

- part of [[hints-contextual-help]] — Ensures user hint dismissal preferences persist across sessions via localStorage sync on each setHintDismissed action

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
