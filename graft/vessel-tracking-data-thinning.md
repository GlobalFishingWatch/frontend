---
name: Vessel Tracking Data Thinning
slug: vessel-tracking-data-thinning
type: file
sources:
  - path: libs/api-client/src/utils/thinning.ts
    hash: 277bf173b607abfcdc81656beda969e35980679816739c0d3e9956a3a0abad2b
sources_digest: 13639e6e846f6d19651fadd137376942ec69cc3cb6f1de5f92187874132767b2
links: []
generator:
  version: 1
covers:
  - symbol: ThinningLevels
    kind: enum
    at: 'libs/api-client/src/utils/thinning.ts:L3-L11'
---

<!-- context:generated:start -->

## Summary

Configuration presets for AIS data reduction balancing volume against tracking granularity. ThinningLevels enum and THINNING_LEVELS lookup table map seven preset levels (Footprint max reduction at 1000m through Default minimal at 0.5m to None no filtering) to ThinningConfig parameters including distance, bearing, speed, accuracy thresholds with separate fishing vs transit states.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
