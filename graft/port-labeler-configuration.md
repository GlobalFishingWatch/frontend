---
name: Port Labeler Configuration
slug: port-labeler-configuration
type: file
sources:
  - path: apps/port-labeler/src/data/config.ts
    hash: bb2db344ec80d196afb454138ef2c5d9bdc19154cf85aabf2fd7435cd2f7fb02
sources_digest: 786937b7bc5327fac247232fb72dfe50681a59483087aa184f592a67d1b07e92
links:
  - to: port-labeler-app
    relation: configures
    description: >-
      DEFAULT_VIEWPORT and REPLACE_URL_PARAMS configure map initialization and
      routing behavior
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Centralizes runtime constants for port-labeler (GOOGLE_TAG_MANAGER_ID, default viewport coordinates, workspace temporal boundaries, NSLABELS_ENDOPOINT URL). Provides environment-dependent settings with production vs development endpoint routing for shared translation labels.

## Related

- configures [[port-labeler-app]] — DEFAULT_VIEWPORT and REPLACE_URL_PARAMS configure map initialization and routing behavior

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
