---
name: Related Vessels Feature
slug: related-vessels-feature
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedEncounterVessels.tsx
    hash: 114fe887103ecf4eba29a28d8d28ad8529768c8fc55470bb7b0f7e46f59f82ed
  - path: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedOwnersVessels.tsx
    hash: 4828197076e97f0ebc66c3e071c4423892b2012b57b18e4a926ecdf6598751c9
  - path: apps/platform/features/_vessels/vessel/related-vessels/RelatedVessel.tsx
    hash: c280a496085b56578189a8136529f4ece5a673aeaa341b6005cc02c986552069
  - path: apps/platform/features/_vessels/vessel/related-vessels/RelatedVessels.tsx
    hash: 5950ce33ec9f4d32957373b86bc480422a7f4df73c492dfca5cf2519ad19337b
sources_digest: 093b9d7cc74ee48fa1a76523bcbe59e23f67930cc537b06c35c8381c6f77f269
links:
  - to: vessel-identity-resolution
    relation: uses
    description: >-
      Uses getCurrentIdentityVessel and formatInfoField to display vessel
      identities in listings
  - to: vessel-navigation-links
    relation: uses
    description: Uses VesselLink to navigate to related vessel profiles
  - to: vessel-profile-core
    relation: part_of
    description: Renders the RelatedVessels tab within the main vessel profile
  - to: vessel-resource-selectors
    relation: uses
    description: >-
      Uses selectEventsGroupedByEncounteredVessel and selectVisibleEvents to
      populate encounter charts
generator:
  version: 1
covers:
  - symbol: VesselTick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedEncounterVessels.tsx:L18-L29
  - symbol: RelatedEncounterVessels
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedEncounterVessels.tsx:L31-L83
  - symbol: OwnerVesselsProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedOwnersVessels.tsx:L24-L29
  - symbol: OwnerVessels
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedOwnersVessels.tsx:L30-L71
  - symbol: RelatedOwnerVessels
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedOwnersVessels.tsx:L73-L136
  - symbol: RelatedVessel
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedVessel.tsx:L17-L57
  - symbol: RelatedVessels
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/related-vessels/RelatedVessels.tsx:L20-L77
---

<!-- context:generated:start -->

## Summary

Tabbed interface for exploring vessels encountered or owned in relation to a selected vessel. RelatedVessels manages tab selection between encounters and owners, syncing state to URL query params. RelatedEncounterVessels shows a bar chart of encounter frequencies via Recharts with custom VesselTick rendering. RelatedOwnersVessels displays hierarchical owner networks using useSearchByOwnerQuery and conditional owner tooltips. Includes VesselActivitySummary section and loading/empty states.

## Related

- uses [[vessel-identity-resolution]] — Uses getCurrentIdentityVessel and formatInfoField to display vessel identities in listings
- uses [[vessel-navigation-links]] — Uses VesselLink to navigate to related vessel profiles
- part of [[vessel-profile-core]] — Renders the RelatedVessels tab within the main vessel profile
- uses [[vessel-resource-selectors]] — Uses selectEventsGroupedByEncounteredVessel and selectVisibleEvents to populate encounter charts

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
