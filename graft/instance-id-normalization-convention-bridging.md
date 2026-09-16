---
name: Instance ID Normalization & Convention Bridging
slug: instance-id-normalization-convention-bridging
type: concept
sources:
  - path: libs/skills/src/encode-url/dictionary.ts
    hash: 6442eb3746cb3db8ac4e311ab001fafc64a90cffbd7e64d7186388cb6e8cb759
sources_digest: e35ef20483a33fc0836a7a5af4e2d1ed408b236ade6b6d83ecbc58fdc93f51e8
links:
  - to: geospatial-layer-dictionary
    relation: implements
    description: getLayerInfo implements the normalization rules
generator:
  version: 1
covers:
  - symbol: LayerCategory
    kind: type
    at: 'libs/skills/src/encode-url/dictionary.ts:L4-L4'
  - symbol: LayerInfo
    kind: type
    at: 'libs/skills/src/encode-url/dictionary.ts:L6-L11'
  - symbol: getLayerInfo
    kind: function
    at: 'libs/skills/src/encode-url/dictionary.ts:L289-L304'
---

<!-- context:generated:start -->

## Summary

getLayerInfo in the dictionary module normalizes layer instance IDs by stripping library timestamps (regex `__<timestamp>`), context-layer prefixes, and recognizing vessel track layers via VESSEL_DATAVIEW_INSTANCE_PREFIX. This bridges internal app naming conventions with backend dataview slugs, requiring careful synchronization with platform configuration.

## Related

- implements [[geospatial-layer-dictionary]] — getLayerInfo implements the normalization rules

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
