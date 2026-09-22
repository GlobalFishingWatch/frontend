---
name: Map Configuration & Styling
slug: map-configuration-styling
type: system
sources:
  - path: apps/platform/data/map/config.ts
    hash: 488f6283103214b26296af4de444c1e41e86e10f8a63301f06cd95ac3e998a9a
sources_digest: ec2aaa6a63e3471ab790bed66603905245f7b795bba282b996517a7c070c7025
links:
  - to: workspace-layer-library-defaults
    relation: configures
    description: >-
      Map config exports constants like layer IDs, port distance thresholds, and
      color schemes that default workspaces reference in layer instances
generator:
  version: 1
covers:
  - symbol: EncounterAuthorizedEventType
    kind: type
    at: 'apps/platform/data/map/config.ts:L141-L142'
---

<!-- context:generated:start -->

## Summary

Centralized map-domain constants including environment flags, storage keys, dataset naming conventions (prefixes), temporal boundaries (2012-present), color schemes for events, layer ordering rules, and report-specific visibility policies. Consumed by workspace initialization and map components to ensure consistent styling and filtering across renders.

## Related

- configures [[workspace-layer-library-defaults]] — Map config exports constants like layer IDs, port distance thresholds, and color schemes that default workspaces reference in layer instances

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
