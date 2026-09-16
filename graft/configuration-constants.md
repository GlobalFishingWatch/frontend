---
name: Configuration & Constants
slug: configuration-constants
type: system
sources:
  - path: libs/dataviews-client/src/config.ts
    hash: be7b96348d13fe0e90fece5ef597d99323b3a92a8df00618c560cd8b7d633d19
  - path: libs/deck-layer-composer/src/config.ts
    hash: 084de09a8c12b8a386bf71cad931b118c6a5af06cd5257530540481bc30b6437
  - path: libs/deck-layer-composer/src/constants.ts
    hash: 5322c9adb051859cf10bc3d8d70bf511a6968356c148a1d7ad3d8ba62a69e172
sources_digest: 6778613534a776586b091036ae5029395facfeb8b301ee4ac01f72e7fdce5906
links:
  - to: dataview-instance-composition
    relation: configures
    description: Provides naming prefixes and version separators for instance ID formatting
  - to: deck-layer-composition-rendering
    relation: configures
    description: Supplies zoom-level grid areas and heatmap rendering parameters
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Centralized configuration for naming conventions (dataview prefixes, suffixes), zoom-level grid areas, heatmap rendering caps, and endpoint defaults. Provides tree-shakeable exports to avoid bundling full libraries when only constants are needed.

## Related

- configures [[dataview-instance-composition]] — Provides naming prefixes and version separators for instance ID formatting
- configures [[deck-layer-composition-rendering]] — Supplies zoom-level grid areas and heatmap rendering parameters

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
