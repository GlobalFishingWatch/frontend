---
name: Worker Build Pipeline
slug: worker-build-pipeline
type: system
sources:
  - path: libs/deck-loaders/scripts/build-workers.mjs
    hash: 0ec6382961ed01bf5fd3c9b6c6c5fdc1ffeb35c30d6020013847cd22a0357844
sources_digest: 7a6122b1c12302f22383529ced736f0f499b20d32025998c65006a49523fb96d
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Build-time bundling infrastructure for Web Worker files using esbuild. The build-workers.mjs script discovers .ts files in nested src/<group>/workers/ directories, validates flattened output name collisions, and bundles each into dist/workers/ as IIFE-format minified browser bundles. Replaces a previous Nx executor approach that required post-build renaming and was fragile on Windows. Reads tsconfig.workers.json and injects empty import.meta.env object to handle environment references in worker code.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
