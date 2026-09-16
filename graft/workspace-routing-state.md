---
name: Workspace & Routing State
slug: workspace-routing-state
type: concept
sources:
  - path: apps/platform/features/_reports/report-port/PortsReportLink.tsx
    hash: 7c005ad01343f1e065e7c3dad56afeef323c97d6bb883b5e22a01b7c86b227ea
  - path: apps/platform/features/_reports/report-vessel-group/VesselGroupReport.tsx
    hash: 7f580f36056311532908c493ddc0809a83d9c822a07b572984b60e44da37e586
  - path: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportTitle.tsx
    hash: 506920e24ebd948b0b0670ab0ed5c98fbe10a74323cd0f60ddc7b14f69b7cdd3
  - path: apps/platform/features/_reports/reports.config.selectors.ts
    hash: 25f63824ec13b62b69ed09f1babcffdefbd309c52c0748a81a542830975e13a3
  - path: apps/platform/features/_reports/reports.selectors.ts
    hash: d0e84334b3d56d9959e7915bee4744ffacf8a21360f788148a7f0b5e08ddd19d
  - path: apps/platform/features/_reports/shared/area-search/area-report.hooks.ts
    hash: 790b51980c0af07644fce1009b88975e3b2685da6868f4b2d550f0fcd6c37a74
sources_digest: ec2836313cc8bfb3a5b39ac7008a695fe6fb141bcd73044762f1887c23106b2e
links:
  - to: report-state-configuration
    relation: produces
    description: >-
      Provides router location and workspace state inputs to cascading selector
      fallback logic
  - to: vessel-group-report-state-management
    relation: produces
    description: >-
      Supplies vessel group ID to thunk conditions and report context to slice
      operations
generator:
  version: 1
covers:
  - symbol: PortsReportLinkProps
    kind: type
    at: 'apps/platform/features/_reports/report-port/PortsReportLink.tsx:L26-L30'
  - symbol: PortsReportLink
    kind: function
    at: 'apps/platform/features/_reports/report-port/PortsReportLink.tsx:L32-L90'
  - symbol: VesselGroupReport
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReport.tsx:L55-L206
  - symbol: VesselGroupReportTitle
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportTitle.tsx:L42-L174
  - symbol: AreaReportProperty
    kind: type
    at: 'apps/platform/features/_reports/reports.config.selectors.ts:L9-L9'
  - symbol: selectReportStateProperty
    kind: function
    at: 'apps/platform/features/_reports/reports.config.selectors.ts:L10-L22'
  - symbol: mergeDataviewInstances
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/area-report.hooks.ts:L19-L33
  - symbol: useNavigateToAreaReport
    kind: function
    at: >-
      apps/platform/features/_reports/shared/area-search/area-report.hooks.ts:L35-L91
---

<!-- context:generated:start -->

## Summary

Central dependency for workspace context (category, id, owner), user authentication, router location (query params, report ID), and time-range selection. Routes report UI decisions based on workspace ownership and currently active navigation state.

## Related

- produces [[report-state-configuration]] — Provides router location and workspace state inputs to cascading selector fallback logic
- produces [[vessel-group-report-state-management]] — Supplies vessel group ID to thunk conditions and report context to slice operations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
