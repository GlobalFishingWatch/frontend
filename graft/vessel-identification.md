---
name: Vessel Identification
slug: vessel-identification
type: file
sources:
  - path: libs/data-transforms/src/vessels/index.ts
    hash: 558d85f270d3aa5d5e90d7304e95bcecb65e97851e071b6a1ae61270e2651abc
  - path: libs/data-transforms/src/vessels/vessels.ts
    hash: bcae69288343f0fca177d6c484461ea49156c94eee494c44e46393c7584c5a44
sources_digest: 66c629ca1fb3547deaddfae31b72ce826c080b7920538b3220ad9762dd35e85b
links: []
generator:
  version: 1
covers:
  - symbol: VesselIdentifierType
    kind: type
    at: 'libs/data-transforms/src/vessels/vessels.ts:L5-L5'
  - symbol: getVesselIdentifierType
    kind: function
    at: 'libs/data-transforms/src/vessels/vessels.ts:L7-L21'
---

<!-- context:generated:start -->

## Summary

Provides vessel identifier classification through pattern matching heuristics. Exports length constants (SSVID=9, IMO=7, CALLSIGN_MIN=4) and getVesselIdentifierType() function that classifies query strings into SSVID (9-digit numeric), IMO (7-digit numeric), or callsign (4+ uppercase alphanumeric) types. Returns undefined for ambiguous inputs. Prioritizes numeric checks before callsign matching to avoid false positives in untrusted query inputs for vessel search/lookup flows.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
