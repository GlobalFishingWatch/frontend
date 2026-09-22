---
name: Vessel Identity Resolution
slug: vessel-identity-resolution
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/vessel.config.selectors.ts
    hash: e1dc4c99414ffecc6ae2b729086e5cfdf19fa3cdfed768c19f788428608e878d
  - path: apps/platform/features/_vessels/vessel/vessel.config.ts
    hash: 9ab4042d8da2cff6a295d74ad6a3f66e63a6504cc83c432992c05d8ff948e18b
  - path: apps/platform/features/_vessels/vessel/vessel.utils.ts
    hash: 2a1a8735c210afcfa33b6cd8dfb9fe67b4f6fa7ac6f2ce3435c9c1cf69b164c2
sources_digest: 07c65835bd60b521aeaddd9acdb9cf8e628605f5eba76b44b5a678c6988ca3ef
links:
  - to: transmission-date-validation
    relation: validates
    description: >-
      getVesselTransmissionDates and isTimerangeOutsideTransmissions validate
      vessel activity windows for timerange bounds checking
  - to: vessel-redux-state-management
    relation: implements
    description: >-
      Provides the identity merging and property access logic that vessel.slice
      uses during fetchVesselInfoThunk
generator:
  version: 1
covers:
  - symbol: VesselProfileProperty
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.config.selectors.ts:L12-L12'
  - symbol: selectVesselProfileStateProperty
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.config.selectors.ts:L13-L21'
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

Utility functions and selectors for accessing, filtering, and transforming vessel identity data across multiple registry sources (self-reported and official). Implements prioritization logic favoring self-reported data when available, deduplicates identities, and provides type-safe access to vessel properties with fallback chains. Handles temporal filtering via transmission date ranges and produces consolidated identity records for search results.

## Related

- validates [[transmission-date-validation]] — getVesselTransmissionDates and isTimerangeOutsideTransmissions validate vessel activity windows for timerange bounds checking
- implements [[vessel-redux-state-management]] — Provides the identity merging and property access logic that vessel.slice uses during fetchVesselInfoThunk

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
