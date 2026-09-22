---
name: Version and Namespace Constants
slug: version-and-namespace-constants
type: file
sources:
  - path: libs/datasets-client/src/constants.ts
    hash: 64bac074c61ad8c8f314d1da43e42f4286090573ae3f75e496a39cc0f17f3edb
sources_digest: 163c9f0da52394124ecdd5f2bc724a2f1028cb6322c57609fbf4095cc5798851
links:
  - to: dataset-utilities-and-version-management
    relation: part_of
    description: >-
      Provides dataset namespace prefixes used throughout dataset identification
      and translation
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Establishes versioning infrastructure and dataset namespace identifiers: PIPE_DATASET_ID version string (v4.0 default, configurable via Vite environment variables), access-level prefixes (public, full, private), and DATASET_COMPARISON_SUFFIX for dataset-comparison dataviews. Designed for sharing across @globalfishingwatch/dataviews-client and @globalfishingwatch/deck-layer-composer without circular dependencies. Centralizes versioning constants to reduce duplication and prevent inversion of dependencies.

## Related

- part of [[dataset-utilities-and-version-management]] — Provides dataset namespace prefixes used throughout dataset identification and translation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
