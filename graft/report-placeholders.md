---
name: Report Placeholders
slug: report-placeholders
type: system
sources:
  - path: >-
      apps/platform/features/_reports/shared/placeholders/ReportSummaryTagsPlaceholder.tsx
    hash: 182a4ada0189c6750e7757ec782e83d2d07c8ec760b9d17fd5e3bc276dcb6626
  - path: >-
      apps/platform/features/_reports/shared/placeholders/ReportTitlePlaceholder.tsx
    hash: 4ef86cf328cadb738ece7f6c126882179696016cdab9235848a298f44c34989c
  - path: >-
      apps/platform/features/_reports/shared/placeholders/ReportVesselsPlaceholder.tsx
    hash: 3ecd6256565cf22fa66cfbde50ed68f6c210e8e9b03b35b29c738874d4e9eeaf
  - path: >-
      apps/platform/features/_reports/shared/placeholders/VGRTitlePlaceholder.tsx
    hash: bc47be232a05d39afb2b6e283d5905d3858728ec6822354e0ce42ca2cb29a17e
sources_digest: 84636125b59d66260db7d51c8655fdbd29d8689d19c3228ef991006254ab4926
links:
  - to: placeholder-animation-infrastructure
    relation: depends_on
    description: >-
      All placeholders import classnames utilities and depend on
      placeholders.module.css for shared animation styles, sizing classes, and
      layout utilities
generator:
  version: 1
covers:
  - symbol: ReportSummaryTagsPlaceholder
    kind: function
    at: >-
      apps/platform/features/_reports/shared/placeholders/ReportSummaryTagsPlaceholder.tsx:L5-L50
  - symbol: ReportTitlePlaceholder
    kind: function
    at: >-
      apps/platform/features/_reports/shared/placeholders/ReportTitlePlaceholder.tsx:L5-L12
  - symbol: ReportVesselsPlaceholder
    kind: function
    at: >-
      apps/platform/features/_reports/shared/placeholders/ReportVesselsPlaceholder.tsx:L8-L83
  - symbol: VGRTitlePlaceholder
    kind: function
    at: >-
      apps/platform/features/_reports/shared/placeholders/VGRTitlePlaceholder.tsx:L6-L41
---

<!-- context:generated:start -->

## Summary

A collection of skeleton-loading components that display animated placeholders for various report sections (titles, tags, vessels, graphs) while actual data loads. Each uses CSS shimmer animations and classnames utilities to approximate real content dimensions and visual hierarchy before hydration.

## Related

- depends on [[placeholder-animation-infrastructure]] — All placeholders import classnames utilities and depend on placeholders.module.css for shared animation styles, sizing classes, and layout utilities

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
