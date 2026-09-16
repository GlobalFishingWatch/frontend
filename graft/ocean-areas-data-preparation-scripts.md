---
name: ocean-areas data preparation scripts
slug: ocean-areas-data-preparation-scripts
type: system
sources:
  - path: libs/ocean-areas/src/scripts/eezs.ts
    hash: 20b9a154f587c2dbe94ec34eab3e84ec907ff13164719f9844a5abba58533d76
  - path: libs/ocean-areas/src/scripts/fao.ts
    hash: ae0fae9734aa27017c32bc424abc2ab37108be080b9f9568663bdf171fcc5b00
  - path: libs/ocean-areas/src/scripts/lib/port-sources.ts
    hash: 35c2d59e838027d55d386f036e80a0ce1fd30f1b2ef8829638c5daac4f59db29
sources_digest: 5ad3375ccc09402361e8478afa9624fd9b3a008ad2ad36b57b13b54252d66a2c
links: []
generator:
  version: 1
covers:
  - symbol: PortSource
    kind: type
    at: 'libs/ocean-areas/src/scripts/lib/port-sources.ts:L3-L3'
  - symbol: getPortSources
    kind: function
    at: 'libs/ocean-areas/src/scripts/lib/port-sources.ts:L5-L9'
---

<!-- context:generated:start -->

## Summary

Configuration scripts that normalize diverse maritime boundary data sources (EEZ, FAO) into standardized field names for storage in cloud buckets. Each script specifies source location, destination bucket, and property mappings (e.g., MRGID_EEZ → area, TERRITORY1 → name).
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
