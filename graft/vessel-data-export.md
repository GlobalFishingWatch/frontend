---
name: Vessel Data Export
slug: vessel-data-export
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel.download.ts
    hash: 74946907093a6b3bee325755934944608434d20d6f15b18272009f176cb11f82
sources_digest: 47fe517d08a2b1912b875d4f287f4ecb6c195687fa475e9a3eba2bb765573478
links:
  - to: vessel-profile-core
    relation: produces
    description: Provides export functionality for vessel profile data
  - to: vessel-resource-selectors
    relation: uses
    description: Consumes structured event and vessel data for serialization
generator:
  version: 1
covers:
  - symbol: parseRegistryOwners
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L15-L21'
  - symbol: parseRegistryExtraField
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L23-L25'
  - symbol: parseRegistryOperator
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L27-L29'
  - symbol: parseRegistryAuthorizations
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L31-L37'
  - symbol: IdentityVesselCSVDownload
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L65-L68'
  - symbol: parseVesselToCSV
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L70-L72'
  - symbol: parseEventsToCSV
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L108-L110'
  - symbol: parseLonglineSetsToCSV
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.download.ts:L127-L131'
---

<!-- context:generated:start -->

## Summary

CSV export functions serializing vessel, event, and longline fishing data for external analysis. parseVesselToCSV, parseEventsToCSV, and parseLonglineSetsToCSV each pair with config objects mapping CSV headers to data accessors with optional transformations. Handles date parsing, list formatting, registry field defaults, and category normalization via getLonglineCategory to ensure export stability across locales. Lacks internationalized column labels (noted TODO).

## Related

- produces [[vessel-profile-core]] — Provides export functionality for vessel profile data
- uses [[vessel-resource-selectors]] — Consumes structured event and vessel data for serialization

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
