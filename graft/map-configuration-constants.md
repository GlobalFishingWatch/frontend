---
name: Map Configuration & Constants
slug: map-configuration-constants
type: system
sources:
  - path: apps/platform/features/_map/map/map.config.ts
    hash: 0baa453d1531026143aa87773dcf20abd2b1ccc5d4d66d6c8225a980fa92714f
sources_digest: 5cbb511bc4252ea59e422034e92cd6621e559e219cf180a2ff9405e3f9f5c5f9
links:
  - to: map-data-selectors
    relation: uses
    description: >-
      Selectors reference layer IDs and configuration constants like
      WORKSPACE_GENERATOR_ID for dataview construction
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Defines layer identifiers, DOM selectors, color palettes, and singleton map view configuration used throughout the map feature. Serves as single source of truth for magic strings and numeric constants to prevent duplication and enable coordinated updates when IDs or styling changes.

## Related

- uses [[map-data-selectors]] — Selectors reference layer IDs and configuration constants like WORKSPACE_GENERATOR_ID for dataview construction

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
