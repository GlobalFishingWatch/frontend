---
name: Vessel Viewer and Identification
slug: vessel-viewer-and-identification
type: system
sources:
  - path: apps/platform/test/integration/VesselsVMSBrazil.spec.tsx
    hash: 487bdd66a608b83c1fbf733cc61015a14be5df90258b748844946e2939a09f1f
  - path: apps/platform/test/integration/VesselViewer.spec.tsx
    hash: b8b0b02822074059e1f348e54cfe6a7ff9ffd7399d844092529eaebdccb86474
sources_digest: 20eab78c502d5275fe72ae695cc5e4cab1c1737efb3e826ae9f7bc8ca8b8a80b
links:
  - to: test-infrastructure-and-utilities
    relation: depends_on
    description: 'Uses render(), makeStore(), GFWAPITestUtils for request mocking'
generator:
  version: 1
covers:
  - symbol: navigateToPublicBrazilVMSViewer
    kind: function
    at: 'apps/platform/test/integration/VesselsVMSBrazil.spec.tsx:L11-L17'
  - symbol: navigateToPrivateBrazilVMSViewer
    kind: function
    at: 'apps/platform/test/integration/VesselsVMSBrazil.spec.tsx:L19-L25'
---

<!-- context:generated:start -->

## Summary

Displays vessel metadata (registry, dimensions, owner), identity tabs (Registry/AIS), event summaries, area breakdowns (EEZ, FAO, RFMO, MPA), and related vessels. Authentication gates access to private vessel fields (Brazilian VMS license codes, registration numbers). Tests verify tab navigation, filtering, and async API request handling.

## Related

- depends on [[test-infrastructure-and-utilities]] — Uses render(), makeStore(), GFWAPITestUtils for request mocking

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
