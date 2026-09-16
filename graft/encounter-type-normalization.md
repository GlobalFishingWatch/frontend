---
name: Encounter Type Normalization
slug: encounter-type-normalization
type: file
sources:
  - path: apps/platform/utils/encounter-types.ts
    hash: f257f7604e5621f594ba6dc9d7fc1aa71d7870483e5a3709f36a5ee9c95be748
sources_digest: c7db75fabd91d6c573d22b676723473fca917d70e94ee9a4e975ee47322bc1d5
links: []
generator:
  version: 1
covers:
  - symbol: getEncounterTypesFromId
    kind: function
    at: 'apps/platform/utils/encounter-types.ts:L1-L11'
  - symbol: getEncounterTypesFromIds
    kind: function
    at: 'apps/platform/utils/encounter-types.ts:L13-L19'
---

<!-- context:generated:start -->

## Summary

Utility functions for normalizing symmetric encounter type identifiers (e.g., 'player-npc' and 'npc-player'). Enables bidirectional encounter query matching by returning both orderings of hyphen-delimited pairs unless identical. Uses Set deduplication for batch processing.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
