---
name: Identity Source Prioritization
slug: identity-source-prioritization
type: concept
sources:
  - path: apps/platform/features/_vessels/vessel/vessel.config.selectors.ts
    hash: e1dc4c99414ffecc6ae2b729086e5cfdf19fa3cdfed768c19f788428608e878d
  - path: apps/platform/features/_vessels/vessel/vessel.ssr.ts
    hash: 0456bd049a508ac944354fe9c2b65ee46e7282abb27e60d80620a4c1e2f2e60b
  - path: apps/platform/features/_vessels/vessel/vessel.utils.ts
    hash: 2a1a8735c210afcfa33b6cd8dfb9fe67b4f6fa7ac6f2ce3435c9c1cf69b164c2
sources_digest: d707d2bfba99ea8b52bc5753f24bee6e146ccae95c29221424ba700d27ca3422
links:
  - to: server-side-rendering-integration
    relation: implements
    description: >-
      vessel.ssr.ts mirrors client-side prioritization logic for accurate page
      metadata generation
  - to: vessel-identity-resolution
    relation: implements
    description: >-
      Encodes the prioritization rules in getLatestIdentityPrioritised and
      getVesselProperty utilities
generator:
  version: 1
covers:
  - symbol: VesselProfileProperty
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.config.selectors.ts:L12-L12'
  - symbol: selectVesselProfileStateProperty
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.config.selectors.ts:L13-L21'
  - symbol: VesselLoaderArgs
    kind: type
    at: 'apps/platform/features/_vessels/vessel/vessel.ssr.ts:L15-L19'
  - symbol: getUrlIdentity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.ssr.ts:L23-L41'
  - symbol: ssrLoadVessel
    kind: function
    at: 'apps/platform/features/_vessels/vessel/vessel.ssr.ts:L43-L75'
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

Multi-source vessel identity resolution with explicit prioritization. When both self-reported (AIS-derived) and registry identities exist, self-reported data takes precedence for ship name and core properties, but registry provides authoritative flag and extended metadata. Configuration is URL-selectable via vesselIdentitySource parameter with intelligent fallback: if registry source requested but unavailable, reverts to self-reported. This separation enables showing up-to-date AIS data while preserving official registry attributes.

## Related

- implements [[server-side-rendering-integration]] — vessel.ssr.ts mirrors client-side prioritization logic for accurate page metadata generation
- implements [[vessel-identity-resolution]] — Encodes the prioritization rules in getLatestIdentityPrioritised and getVesselProperty utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
