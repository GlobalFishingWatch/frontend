---
name: Dataset Identifier Conventions
slug: dataset-identifier-conventions
type: file
sources:
  - path: libs/datasets-client/src/migrations/datasets.conventions.ts
    hash: e6a3f0ff4b5525848b2f85a98942773b58d824f6dc16e23387b347554a906501
sources_digest: 803a3b4247225bdb0a6abfc4fced6ea47807d6a11165592e284ce12c0b793488
links:
  - to: dataset-configuration-and-filtering
    relation: implements
    description: Canonical identifiers used throughout dataset configuration and utilities
generator:
  version: 1
covers:
  - symbol: DatasetSourceId
    kind: type
    at: 'libs/datasets-client/src/migrations/datasets.conventions.ts:L7-L7'
  - symbol: CountryDatasetId
    kind: type
    at: 'libs/datasets-client/src/migrations/datasets.conventions.ts:L35-L35'
---

<!-- context:generated:start -->

## Summary

Defines canonical dataset identifier conventions as literal type unions using const assertions: DatasetSourceId (AIS, VMS maritime tracking sources) and CountryDatasetId (regional datasets from eleven countries: Brazil, Chile, Peru, etc.). Serves as contracts layer for type-safe dataset references throughout the application, preventing invalid identifiers from being used in dependent code without external dependencies beyond TypeScript's type system.

## Related

- implements [[dataset-configuration-and-filtering]] — Canonical identifiers used throughout dataset configuration and utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
