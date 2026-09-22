---
name: Feature Property Extraction
slug: feature-property-extraction
type: concept
sources:
  - path: apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts
    hash: 85eb5ab12525fe0dd01d2a27503e08d532c717c54c46e9659f48a8e44a671747
  - path: apps/platform/features/_map/map/popups/map-popups.utils.ts
    hash: deeeb79dfc75625839eb9b973ab64975a8c86c8c0a07126b5fed102b54febb9c
sources_digest: c4e806e1cd5076f0fe52e30cd0f36530bd38fda40d4e1cfc069d4a4c776ae124
links:
  - to: context-layer-tooltips
    relation: part_of
    description: >-
      Feature extraction is critical for area identification in context layer
      interactions
generator:
  version: 1
covers:
  - symbol: getAreaIdFromFeature
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts:L20-L27
  - symbol: useContextInteractions
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts:L29-L101
  - symbol: getCleanPropertiesList
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L17-L23'
  - symbol: parsePropertiesList
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L25-L38'
  - symbol: getContextValue
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L40-L55'
  - symbol: getContextLayerId
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L57-L64'
  - symbol: getUserContextLayerLabel
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L66-L100'
  - symbol: getIntervalDateFormat
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L102-L106'
---

<!-- context:generated:start -->

## Summary

A pattern for reliably extracting identifying information from deck-layers picking objects despite varying data structures across layer types. Key identifier extraction relies on getAreaIdFromFeature (preferring gfw_id property), with fallback logic and developer warnings when expected properties are missing. The pattern extends to broader property parsing via getContextValue and getCleanPropertiesList with HIDDEN_KEYS filtering and alphabetic sorting for consistent presentation.

## Related

- part of [[context-layer-tooltips]] — Feature extraction is critical for area identification in context layer interactions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
