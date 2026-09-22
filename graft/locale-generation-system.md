---
name: Locale Generation System
slug: locale-generation-system
type: file
sources:
  - path: libs/ocean-areas/src/scripts/locales.ts
    hash: 46d199f97d827c35f71eebce465518f9c3b73132704650fbe9b9c8ba8ec341bf
sources_digest: 8457c7b385a3a0647928b93436c8ca419c4a09ad110e09e7ed6ecc1ced648492
links:
  - to: geojson-validation-and-invariants
    relation: depends_on
    description: >-
      Expects valid GeoJSON features with name properties from EEZ and FAO
      datasets
generator:
  version: 1
covers:
  - symbol: start
    kind: function
    at: 'libs/ocean-areas/src/scripts/locales.ts:L10-L27'
---

<!-- context:generated:start -->

## Summary

Consolidates geographic region names from EEZ and FAO boundary GeoJSON datasets into a sorted, deduplicated key-value dictionary for internationalization workflows. Writes output to locales/source.json as a build-time initialization task.

## Related

- depends on [[geojson-validation-and-invariants]] — Expects valid GeoJSON features with name properties from EEZ and FAO datasets

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
