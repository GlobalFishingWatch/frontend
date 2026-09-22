---
name: Vessel Info Formatting
slug: vessel-info-formatting
type: system
sources:
  - path: apps/platform/utils/info.ts
    hash: 76cad98d56bfca003460163b694057272518a1a2369f4b46082c1a6468560170
sources_digest: 6bd8d993350dc7269f920056b5ea847f2992879f9be955a62069fde7b898003f
links:
  - to: i18n-system
    relation: depends_on
    description: >-
      formatInfoField and all label functions depend on i18next translation
      context and locale-aware number/date formatting
  - to: redux-store
    relation: depends_on
    description: Imports vessel state slice to access vessel type and gear type data
generator:
  version: 1
covers:
  - symbol: upperFirst
    kind: function
    at: 'apps/platform/utils/info.ts:L21-L23'
  - symbol: formatNumber
    kind: function
    at: 'apps/platform/utils/info.ts:L25-L30'
  - symbol: getVesselShipTypeLabel
    kind: function
    at: 'apps/platform/utils/info.ts:L32-L53'
  - symbol: getVesselGearTypeLabel
    kind: function
    at: 'apps/platform/utils/info.ts:L55-L83'
  - symbol: formatInfoField
    kind: function
    at: 'apps/platform/utils/info.ts:L85-L190'
  - symbol: getVesselOtherNamesLabel
    kind: function
    at: 'apps/platform/utils/info.ts:L192-L198'
  - symbol: getDetectionsTimestamps
    kind: function
    at: 'apps/platform/utils/info.ts:L201-L203'
  - symbol: sortOptionsAlphabetically
    kind: function
    at: 'apps/platform/utils/info.ts:L205-L209'
---

<!-- context:generated:start -->

## Summary

Centralized formatters for vessel attributes (ship types, gear types, flags, names, licenses) that provide consistent internationalization, type conversions, and field-specific presentation logic across the platform. Acts as a dispatcher that normalizes diverse vessel data into display-ready labels with proper translation and deduplication.

## Related

- depends on [[i18n-system]] — formatInfoField and all label functions depend on i18next translation context and locale-aware number/date formatting
- depends on [[redux-store]] — Imports vessel state slice to access vessel type and gear type data

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
