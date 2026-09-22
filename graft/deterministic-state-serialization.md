---
name: Deterministic State Serialization
slug: deterministic-state-serialization
type: concept
sources:
  - path: apps/platform/features/debug/DebugTestingTools.tsx
    hash: b4a31c7f2a735d5191c861f8cc1bd5d013006db74cffcbf9dd29531dc3c25fad
sources_digest: 82648675eea823d779a3aab9fe26992e2cec3f7d378129cc7611d41deb0daffc
links:
  - to: debug-system
    relation: part_of
    description: >-
      Ensures Redux state exports are deterministically ordered for consistent
      diffing in test scenarios
generator:
  version: 1
covers:
  - symbol: sortObjectKeysDeep
    kind: function
    at: 'apps/platform/features/debug/DebugTestingTools.tsx:L12-L34'
  - symbol: DebugTestingTools
    kind: function
    at: 'apps/platform/features/debug/DebugTestingTools.tsx:L36-L84'
  - symbol: getStringifyState
    kind: function
    at: 'apps/platform/features/debug/DebugTestingTools.tsx:L39-L52'
---

<!-- context:generated:start -->

## Summary

Pattern in DebugTestingTools that recursively sorts object keys and normalizes primitive arrays alphabetically before JSON stringification, enabling byte-for-byte comparable Redux state snapshots across test runs and environments for reproducible bug reports.

## Related

- part of [[debug-system]] — Ensures Redux state exports are deterministically ordered for consistent diffing in test scenarios

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
