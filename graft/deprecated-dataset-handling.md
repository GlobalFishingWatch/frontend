---
name: Deprecated Dataset Handling
slug: deprecated-dataset-handling
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/VesselDeprecatedLink.tsx
    hash: fbab7a4554d1a1426be18d9a6e3a3f50dffa7f3e2a9ebb39f44649cfb317c715
sources_digest: 56abd2267737e5f7b27be14dfff7ff142f9faef58d0894fff507d720f0da2d6f
links:
  - to: vessel-identity-resolution
    relation: uses
    description: Extracts vessel properties for search query pre-fill
  - to: vessel-profile-core
    relation: part_of
    description: Renders warning banner for deprecated vessel datasets within profile
generator:
  version: 1
covers:
  - symbol: VesselDeprecatedLink
    kind: function
    at: 'apps/platform/features/_vessels/vessel/VesselDeprecatedLink.tsx:L16-L56'
---

<!-- context:generated:start -->

## Summary

VesselDeprecatedLink warns users when a vessel's dataset has been deprecated, providing navigation to vessel search with pre-filled parameters (ship name, SSVID if applicable, flag, deprecated dataset source). Conditionally includes SSVID based on dataset type via getIsVMSDataset, since VMS data may not support SSVID filtering. Depends on Redux selectors for deprecated dataset lookup and vessel property utilities for label construction.

## Related

- uses [[vessel-identity-resolution]] — Extracts vessel properties for search query pre-fill
- part of [[vessel-profile-core]] — Renders warning banner for deprecated vessel datasets within profile

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
