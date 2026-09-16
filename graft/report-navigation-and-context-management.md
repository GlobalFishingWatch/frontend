---
name: Report Navigation and Context Management
slug: report-navigation-and-context-management
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/GlobalReportLink.tsx
    hash: f317af6d30a5b0e2f5718126340c0bafd3ff2450b193eff7f941c7f533f36101
sources_digest: 105a1047397be3e33bcd9485870d41a408c7f520310a5b80b9495f9fdd55cc46
links:
  - to: router-query-parameter-management
    relation: uses
    description: >-
      Constructs navigation links with resetted geographic parameters while
      preserving other query state
  - to: workspace-and-dataview-state-selectors
    relation: uses
    description: >-
      GlobalReportLink reads selectWorkspace selector to retrieve current
      workspace context for route parameter construction
generator:
  version: 1
covers:
  - symbol: GlobalReportLink
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/GlobalReportLink.tsx:L15-L46'
---

<!-- context:generated:start -->

## Summary

Handles navigation between workspace map view and report pages via GlobalReportLink component, which constructs route parameters by combining workspace context with report category selection. Resets geographic search parameters (lat/lon/zoom) to global defaults while preserving query state, and triggers viewport adjustments via useFitAreaInViewport hook to synchronize map and report views.

## Related

- uses [[router-query-parameter-management]] — Constructs navigation links with resetted geographic parameters while preserving other query state
- uses [[workspace-and-dataview-state-selectors]] — GlobalReportLink reads selectWorkspace selector to retrieve current workspace context for route parameter construction

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
