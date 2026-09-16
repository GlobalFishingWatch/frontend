---
name: Geospatial Layer Dictionary
slug: geospatial-layer-dictionary
type: file
sources:
  - path: libs/skills/src/encode-url/dictionary.ts
    hash: 6442eb3746cb3db8ac4e311ab001fafc64a90cffbd7e64d7186388cb6e8cb759
sources_digest: e35ef20483a33fc0836a7a5af4e2d1ed408b236ade6b6d83ecbc58fdc93f51e8
links:
  - to: dataset-version-resolution
    relation: uses
    description: >-
      Dataview slugs may contain version placeholders resolved via
      resolveDataviewSlug
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

Maintains a registry of ~80+ geospatial data layers (LayerCategory: activity, detections, events, environment, context) with human-readable names and optional backend dataview slugs. getLayerInfo resolves instance IDs by normalizing conventions: stripping timestamps, context prefixes, and recognizing vessel tracks via prefix matching.

## Related

- uses [[dataset-version-resolution]] — Dataview slugs may contain version placeholders resolved via resolveDataviewSlug

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
