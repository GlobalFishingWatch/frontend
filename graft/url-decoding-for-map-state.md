---
name: URL Decoding for Map State
slug: url-decoding-for-map-state
type: system
sources:
  - path: libs/skills/src/decode-url/decode.ts
    hash: ef802ede6f01112f5c7930770f15ef3701c8fdfd9bd00bf4ac2be5ee147d64b4
sources_digest: 5dbf6c79bd9bb8372ee0e952eb20f29b607b98ccea05844c0d6e0ffbb7262255
links:
  - to: geospatial-layer-dictionary
    relation: uses
    description: Calls getLayerInfo to resolve and normalize layer instance IDs
  - to: workspace-naming-lookup
    relation: uses
    description: References HIGHLIGHTED_WORKSPACES to identify curated workspace names
generator:
  version: 1
covers:
  - symbol: DecodedLayer
    kind: type
    at: 'libs/skills/src/decode-url/decode.ts:L11-L19'
  - symbol: DecodedMapUrl
    kind: type
    at: 'libs/skills/src/decode-url/decode.ts:L21-L34'
  - symbol: pickByPrefix
    kind: function
    at: 'libs/skills/src/decode-url/decode.ts:L36-L41'
  - symbol: decodeMapUrl
    kind: function
    at: 'libs/skills/src/decode-url/decode.ts:L43-L87'
---

<!-- context:generated:start -->

## Summary

Decodes shareable URLs back into structured map state (DecodedMapUrl). decodeMapUrl parses workspace via parseWorkspace, extracts layer metadata using getLayerInfo with ID normalization, identifies curated workspaces via HIGHLIGHTED_WORKSPACES, and segregates state into semantic sections (report, vessel, search) with prefix matching.

## Related

- uses [[geospatial-layer-dictionary]] — Calls getLayerInfo to resolve and normalize layer instance IDs
- uses [[workspace-naming-lookup]] — References HIGHLIGHTED_WORKSPACES to identify curated workspace names

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
