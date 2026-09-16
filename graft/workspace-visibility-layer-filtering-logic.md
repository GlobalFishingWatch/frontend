---
name: Workspace Visibility & Layer Filtering Logic
slug: workspace-visibility-layer-filtering-logic
type: concept
sources:
  - path: apps/platform/data/map/default-workspaces/workspace.development.ts
    hash: 6158a8b402cd2b50f4d6eb2b47c32a3db55e0cf2a598d5e9258e98e702a9df3a
  - path: apps/platform/data/map/default-workspaces/workspace.production.ts
    hash: 16918cc9d574d7136cbcc1a797ea4517744dd302ae0d567069175f2b4d406f14
  - path: apps/platform/data/map/highlighted-workspaces/marine-manager.dataviews.ts
    hash: 752adb931de034723625ac47406b717c9b337c80384502ec271067f30b32f4e8
sources_digest: 0dace0880c65571ba4bc4a845b3a4a3191f4be73864307675fd534299b6ce309
links:
  - to: workspace-layer-library-defaults
    relation: implements
    description: >-
      Default workspace instances specify visibility states and filter
      configurations for all layers
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Pattern that most activity and detection layers initialize with visible:false and visible:true for AIS only (with 3km port-distance filter). Enforcement of layer visibility rules and filter defaults prevents accidental exposure of expensive-to-render satellite imagery or event clusters. Layer filtering applies before rendering to avoid O(N) UI searches.

## Related

- implements [[workspace-layer-library-defaults]] — Default workspace instances specify visibility states and filter configurations for all layers

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
