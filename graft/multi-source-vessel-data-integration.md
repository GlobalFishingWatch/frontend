---
name: Multi-Source Vessel Data Integration
slug: multi-source-vessel-data-integration
type: concept
sources:
  - path: libs/api-types/src/vessel-report.ts
    hash: c0219e3da22e7eaca6e6fb441bd660c3398dcf7ce988fae8eb2283ff7ba37388
  - path: libs/api-types/src/vessel.ts
    hash: b4247655ddb94f516d3234b61d075cd0d50f99c76ddf9946ea52bc73663174a6
sources_digest: 8c9559fb4d3befe2cde167a4319a420fbee8ecb0a7582e2d7e9818795dbf1718
links: []
generator:
  version: 1
covers:
  - symbol: ReportVessel
    kind: type
    at: 'libs/api-types/src/vessel-report.ts:L1-L19'
  - symbol: ReportVesselsByDataset
    kind: type
    at: 'libs/api-types/src/vessel-report.ts:L21-L23'
  - symbol: Authorization
    kind: type
    at: 'libs/api-types/src/vessel.ts:L1-L7'
  - symbol: VesselTypeV2
    kind: type
    at: 'libs/api-types/src/vessel.ts:L9-L18'
  - symbol: Vessel
    kind: type
    at: 'libs/api-types/src/vessel.ts:L20-L56'
  - symbol: VesselSearch
    kind: type
    at: 'libs/api-types/src/vessel.ts:L58-L62'
  - symbol: RelatedVesselSearchMerged
    kind: type
    at: 'libs/api-types/src/vessel.ts:L64-L66'
---

<!-- context:generated:start -->

## Summary

Design pattern across Vessel, VesselSearch, and RelatedVesselSearchMerged types that accommodates heterogeneous upstream systems through optional source, dataset, origin, and vesselMatchId fields. The minimal required fields (id, flag, shipname, transmission dates) allow incomplete records to flow through the system, with identifier plurality (mmsi, ssvid, nationalId, matricula) supporting multiple maritime jurisdictions and registries.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
