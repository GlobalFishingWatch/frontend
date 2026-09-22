---
name: Dataview Layer Management
slug: dataview-layer-management
type: concept
sources:
  - path: apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx
    hash: 45826fa03f3a87625df708e4991069bd3162c4548b19ac386cd1a0eacc3757dd
sources_digest: b4d66158711b59683f16732363ca0b91d3d09afa4b399a706c28e8fab5b3ccac
links:
  - to: report-summary
    relation: implements
    description: >-
      ReportSummaryTags component exposes dataview mutation UI and dispatches
      Redux actions to persist changes
generator:
  version: 1
covers:
  - symbol: LayerPanelProps
    kind: type
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L38-L43
  - symbol: ReportSummaryTags
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L45-L217
  - symbol: onToggleFiltersUIOpen
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L64-L66
  - symbol: onToggleColorOpen
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L67-L69
  - symbol: onColorClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L70-L79
  - symbol: onTagRemoveClick
    kind: function
    at: >-
      apps/platform/features/_reports/shared/summary/ReportSummaryTags.tsx:L81-L83
---

<!-- context:generated:start -->

## Summary

A pattern for managing dataview lifecycle (creation, mutation, deletion) through Redux slices and hooks. ReportSummaryTags exposes UI controls for color configuration, filter selection, and layer removal; these changes dispatch upsertDataviewInstance and deleteDataviewInstance actions. Bathymetry dataviews are conditionally hidden for Environment reports lacking min/max visible value constraints, and time-comparison contexts disable filter editing.

## Related

- implements [[report-summary]] — ReportSummaryTags component exposes dataview mutation UI and dispatches Redux actions to persist changes

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
