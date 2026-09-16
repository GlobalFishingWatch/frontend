---
name: Platform App Utilities
slug: platform-app-utilities
type: system
sources:
  - path: apps/platform/utils/html-parser.tsx
    hash: 5e32b0529b7cfe44ff6f67a3449aecf6b90acc99bcb84c08bb1262e612ebd709
  - path: apps/platform/utils/img.ts
    hash: 3b2b9a71e9398f9fe0161e479f9890c10e8cfe252b5d58703ab9a4844b3efd7e
  - path: apps/platform/utils/info.ts
    hash: 76cad98d56bfca003460163b694057272518a1a2369f4b46082c1a6468560170
  - path: apps/platform/utils/polyfills.ts
    hash: 79c7848a63d2ac17987e5e74ee6e0aac27d8cc77243c35430f6e6e6419528214
  - path: apps/platform/utils/ports.ts
    hash: 5d53d0dc9f3f8288131f4f2890896abd952ebb52eb2086c42532d0a646b4884f
  - path: apps/platform/utils/selectors.ts
    hash: eff89dba248f5a491f2165d56879505ca8d5b8bb5a2d46da59b74320db7fe5e7
  - path: apps/platform/utils/shared.ts
    hash: 8e5074e8b33fcd7c1853ee79c18d0ef76b9dc1f0028c973400ace6c9d0a7070f
  - path: apps/platform/utils/statistics.ts
    hash: d331835c062e3964a1d57fa359e44911f4c4a0b90674257acbff342181e48090
  - path: apps/platform/utils/text.tsx
    hash: 6740eedaac26d47639bb5694545b9d785abcdf4396fac469709781f46c3381ec
  - path: apps/platform/utils/url.ts
    hash: cd678c1ab8f2c51e59a4631c280cd1e057a0afeda47aeba5491937f3c74bc9aa
sources_digest: 00030a25d03b804f7f30abe18a2caa0fad2ea3229a05e599acf2cd2b170ab82e
links:
  - to: i18n-system
    relation: depends_on
    description: >-
      info.ts, shared.ts, and ports.ts depend on i18n translation functions and
      locale-aware formatting from features/i18n
  - to: redux-store
    relation: depends_on
    description: >-
      ports.ts uses Redux state (vessel.slice) to access vessel information for
      formatting
  - to: safe-html-parsing-workaround
    relation: implements
    description: >-
      html-parser.tsx wraps html-react-parser with Google Translate mitigation
      via text node wrapping
generator:
  version: 1
covers:
  - symbol: htmlSafeParse
    kind: function
    at: 'apps/platform/utils/html-parser.tsx:L14-L16'
  - symbol: handleOpenImage
    kind: function
    at: 'apps/platform/utils/img.ts:L1-L51'
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
  - symbol: Port
    kind: type
    at: 'apps/platform/utils/ports.ts:L7-L7'
  - symbol: PortData
    kind: type
    at: 'apps/platform/utils/ports.ts:L8-L8'
  - symbol: loadPorts
    kind: function
    at: 'apps/platform/utils/ports.ts:L14-L23'
  - symbol: subscribe
    kind: function
    at: 'apps/platform/utils/ports.ts:L25-L30'
  - symbol: usePorts
    kind: function
    at: 'apps/platform/utils/ports.ts:L32-L44'
  - symbol: parsePort
    kind: function
    at: 'apps/platform/utils/ports.ts:L46-L52'
  - symbol: getPortsByIds
    kind: function
    at: 'apps/platform/utils/ports.ts:L54-L61'
  - symbol: getPorts
    kind: function
    at: 'apps/platform/utils/ports.ts:L65-L65'
  - symbol: capitalize
    kind: function
    at: 'apps/platform/utils/shared.ts:L5-L8'
  - symbol: toFixed
    kind: function
    at: 'apps/platform/utils/shared.ts:L10-L16'
  - symbol: Field
    kind: type
    at: 'apps/platform/utils/shared.ts:L18-L18'
  - symbol: sortStrings
    kind: function
    at: 'apps/platform/utils/shared.ts:L20-L20'
  - symbol: sortFields
    kind: function
    at: 'apps/platform/utils/shared.ts:L22-L38'
  - symbol: listAsSentence
    kind: function
    at: 'apps/platform/utils/shared.ts:L40-L45'
  - symbol: weightedMean
    kind: function
    at: 'apps/platform/utils/statistics.ts:L1-L17'
  - symbol: getHighlightedText
    kind: function
    at: 'apps/platform/utils/text.tsx:L3-L36'
  - symbol: regEscape
    kind: function
    at: 'apps/platform/utils/text.tsx:L16-L16'
  - symbol: getSearchPreview
    kind: function
    at: 'apps/platform/utils/text.tsx:L38-L45'
  - symbol: getUrlViewstateNumericParam
    kind: function
    at: 'apps/platform/utils/url.ts:L3-L11'
---

<!-- context:generated:start -->

## Summary

Collection of reusable utility functions and helpers across the platform application, providing text processing, URL/DOM handling, formatting, image display, and safe HTML parsing. These utilities form the foundation for consistent data presentation and browser interactions throughout the platform.

## Related

- depends on [[i18n-system]] — info.ts, shared.ts, and ports.ts depend on i18n translation functions and locale-aware formatting from features/i18n
- depends on [[redux-store]] — ports.ts uses Redux state (vessel.slice) to access vessel information for formatting
- implements [[safe-html-parsing-workaround]] — html-parser.tsx wraps html-react-parser with Google Translate mitigation via text node wrapping

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
