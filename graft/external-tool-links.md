---
name: External Tool Links
slug: external-tool-links
type: file
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/identity/VesselExternalToolLinks.tsx
    hash: 9d5572a5178d279c534c68d5770552fb975753efbe61e60844ef93839ef51ab0
sources_digest: 902da0d5d51293121cf49a8aaeeee06211c7bb78e7d7bd07e94217e0fca5f5e9
links:
  - to: configuration-driven-layout-pattern
    relation: depends_on
    description: >-
      Uses getSkylightLink utility and vessel identity data to construct
      external service URLs
generator:
  version: 1
covers:
  - symbol: VesselExternalToolLinksProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/identity/VesselExternalToolLinks.tsx:L12-L15
  - symbol: VesselExternalToolLinks
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/identity/VesselExternalToolLinks.tsx:L17-L73
---

<!-- context:generated:start -->

## Summary

Renders clickable links to third-party maritime tracking services (Marine Traffic, Skylight, Triton, CRAVT) prefilled with vessel identifiers (SSVID, IMO, callsign, shipname). Prefers IMO for Triton and CRAVT; fallback chain prioritizes best-available identifiers.

## Related

- depends on [[configuration-driven-layout-pattern]] — Uses getSkylightLink utility and vessel identity data to construct external service URLs

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
