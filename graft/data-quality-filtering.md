---
name: Data Quality Filtering
slug: data-quality-filtering
type: concept
sources:
  - path: libs/ocean-areas/src/scripts/ports-to-list.ts
    hash: c182a523381d390ba67fdc8358366d612ee8cb1e61f70e661c339544772eeede
  - path: libs/ocean-areas/src/scripts/ports.ts
    hash: 688195fddef776a8d0e420ba4bdf0b67e7f5ccfc0c55d4bedea116b71f0c7ce8
sources_digest: 5502183c16aee36fb8241c627aece7a14d26e902f58ca493ca37302b7cd9a29f
links: []
generator:
  version: 1
covers:
  - symbol: PortFeature
    kind: type
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L5-L17'
  - symbol: PortListData
    kind: type
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L18-L22'
  - symbol: isPlaceholderName
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L28-L39'
  - symbol: quote
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L41-L43'
  - symbol: toTsModule
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L45-L54'
  - symbol: convertPortsToList
    kind: function
    at: 'libs/ocean-areas/src/scripts/ports-to-list.ts:L56-L89'
---

<!-- context:generated:start -->

## Summary

Port data excludes records with placeholder or auto-generated names detected via regex patterns (NUMERIC_NAME for pure numbers, HEX_NAME for hex strings, ISO_DASH_NUMBER for ISO codes) and entries where port name is prefixed with flag code. Prevents incomplete/generated identifiers from reaching final dataset.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
