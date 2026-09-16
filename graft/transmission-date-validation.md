---
name: Transmission Date Validation
slug: transmission-date-validation
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts
    hash: 4e7d64d932db428d60d94ea796356fca59cea28892e0706221d06ac8779ad5a1
  - path: apps/platform/features/_vessels/vessel/vessel.utils.spec.ts
    hash: 732292124ad09646b24890bee4bb1a575faf4547295653c7fd6ba75d6070b1dc
  - path: apps/platform/features/_vessels/vessel/vessel.utils.ts
    hash: 2a1a8735c210afcfa33b6cd8dfb9fe67b4f6fa7ac6f2ce3435c9c1cf69b164c2
sources_digest: 0431cf57f94a4f139620f678164617a0daa785b446d9953bb96c8ed141f4e7db
links:
  - to: vessel-bounds-and-time-synchronization
    relation: implements
    description: >-
      vessel-bounds hooks use transmission date validation to confirm timerange
      changes
  - to: vessel-identity-resolution
    relation: depends_on
    description: >-
      Depends on getVesselIdentities to access self-reported identity
      transmission dates
generator:
  version: 1
covers:
  - symbol: useGetVesselProfileBbox
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L23-L33'
  - symbol: useVesselProfileBounds
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L35-L90'
  - symbol: useVesselFitBoundsOnLoad
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L92-L106'
  - symbol: useVesselFitTranmissionsBounds
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L108-L153'
  - symbol: useVesselFitBounds
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel-bounds.hooks.ts:L155-L161'
  - symbol: check
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.spec.ts:L41-L42'
  - symbol: VesselsParamsSupported
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L30-L30'
  - symbol: GetVesselIdentityParams
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L31-L31'
  - symbol: getVesselCombinedSource
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L33-L38'
  - symbol: getVesselCombinedSourceProperty
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L40-L52'
  - symbol: getVesselIdentitiesBySource
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L54-L89'
  - symbol: getVesselIdentities
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L91-L123'
  - symbol: getVesselIdentityId
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L125-L129'
  - symbol: getVesselIdentity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L131-L139'
  - symbol: VesselIdentityProperty
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L141-L142'
  - symbol: VesselProperty
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L144-L152'
  - symbol: getVesselProperty
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L153-L185'
  - symbol: getLatestIdentityPrioritised
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L187-L207'
  - symbol: getMatchCriteriaPrioritised
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L209-L217'
  - symbol: getBestMatchCriteriaIdentity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L219-L234'
  - symbol: getVesselId
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L236-L244'
  - symbol: getRelatedIdentityVesselIds
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L246-L255'
  - symbol: SearchIdentityResolvedParams
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L257-L259'
  - symbol: getVesselTransmissionDates
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L263-L282'
  - symbol: isBefore
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L264-L265'
  - symbol: getSearchIdentityResolved
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L284-L329'
  - symbol: sortVesselRegistryProperties
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L331-L341'
  - symbol: getCurrentIdentityVessel
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L343-L363'
  - symbol: getVoyageTimeRange
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L365-L367'
  - symbol: filterRegistryInfoByDateAndSSVID
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L369-L384'
  - symbol: getOtherVesselNames
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L386-L395'
  - symbol: isFieldLoginRequired
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L397-L399'
  - symbol: formatTransmissionDate
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L401-L410'
  - symbol: getIdentitySourceLabel
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L412-L428'
  - symbol: isTimerangeOutsideTransmissions
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L430-L443'
  - symbol: getSkylightLink
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.utils.ts:L445-L447'
---

<!-- context:generated:start -->

## Summary

Ensures vessel timeranges align with actual transmission data availability. getVesselTransmissionDates extracts earliest-start and latest-end from self-reported identities; isTimerangeOutsideTransmissions checks overlap. Prevents user confusion by auto-adjusting timerange bounds on profile load, with optional confirmation dialog when external link timerange predates vessel transmissions. Prioritizes self-reported dates over registry to capture AIS activity windows.

## Related

- implements [[vessel-bounds-and-time-synchronization]] — vessel-bounds hooks use transmission date validation to confirm timerange changes
- depends on [[vessel-identity-resolution]] — Depends on getVesselIdentities to access self-reported identity transmission dates

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
