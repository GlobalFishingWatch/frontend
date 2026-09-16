---
name: Port Report Link & Navigation
slug: port-report-link-navigation
type: file
sources:
  - path: apps/platform/features/_reports/report-port/PortsReportLink.tsx
    hash: 7c005ad01343f1e065e7c3dad56afeef323c97d6bb883b5e22a01b7c86b227ea
sources_digest: f651b63452bd1c06c00f6d120cdb439e2a22e1f60a525e5ba9b797c4fc7b7f47
links:
  - to: report-state-configuration
    relation: uses
    description: >-
      Augments existing dataview instances with port-specific configuration
      before passing to route
  - to: workspace-routing-state
    relation: depends_on
    description: >-
      Reads workspace context and URL location parameters to construct report
      navigation
generator:
  version: 1
covers:
  - symbol: PortsReportLinkProps
    kind: type
    at: 'apps/platform/features/_reports/report-port/PortsReportLink.tsx:L26-L30'
  - symbol: PortsReportLink
    kind: function
    at: 'apps/platform/features/_reports/report-port/PortsReportLink.tsx:L32-L90'
---

<!-- context:generated:start -->

## Summary

Navigable link component routing users to detailed port reports while preserving workspace context and dataview state. Augments dataview instances with port-specific clustering and applies satellite basemap defaults via URL parameters.

## Related

- uses [[report-state-configuration]] — Augments existing dataview instances with port-specific configuration before passing to route
- depends on [[workspace-routing-state]] — Reads workspace context and URL location parameters to construct report navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
