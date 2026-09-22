---
name: Dataset Field Display Components
slug: dataset-field-display-components
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx
    hash: 59a96af07c43483b9b8f4e18fd1195b762f3fb4f0521f3fddbfd297ba7121578
  - path: apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx
    hash: 7683a044f46cdb352e05edea36feb7852cfa772572e6c7156cf9fa585df6def3
sources_digest: b931a4eba2068bebec43b82a172f2395e3eebb35e6cb23a1f6a6650dc14ff429
links:
  - to: dataview-instance-connector
    relation: uses
    description: >-
      Calls upsertDataviewInstance to apply filter/source removals or dataview
      deletion
  - to: filter-type-and-unit-transformation-patterns
    relation: depends_on
    description: >-
      DatasetSchemaField uses getFilterValueById and getValueLabelByUnit to
      transform and display filter values with appropriate units
generator:
  version: 1
covers:
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L33-L39
  - symbol: DatasetSchemaField
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L41-L166
  - symbol: toDisplay
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSchemaField.tsx:L90-L90
  - symbol: DatasetFilterSourceProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx:L15-L21
  - symbol: DatasetFilterSource
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx:L23-L105
  - symbol: onRemoveFilterClick
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetSourceField.tsx:L59-L63
---

<!-- context:generated:start -->

## Summary

Renders labeled displays of selected filter values and dataset sources within layer panels. DatasetSchemaField shows range filters with abbreviated notation (≤ 100, 50-200) and categorical selections as tags. DatasetSourceField displays sources with optional merging of multiple VMS sources into grouped tags, migration warnings, and deletion capabilities.

## Related

- uses [[dataview-instance-connector]] — Calls upsertDataviewInstance to apply filter/source removals or dataview deletion
- depends on [[filter-type-and-unit-transformation-patterns]] — DatasetSchemaField uses getFilterValueById and getValueLabelByUnit to transform and display filter values with appropriate units

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
