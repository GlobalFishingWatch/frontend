---
name: Vessel Pinning and Workspace Integration
slug: vessel-pinning-and-workspace-integration
type: system
sources:
  - path: apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts
    hash: a5cdfa621b1192695a9d10118d6365026cac95a18c0fd87f5a5c11bf2af8d66a
sources_digest: cb60ab67c95c6fa6291b2c9ae80894c741a4d762e98f6692cfb409f084746a13
links:
  - to: dataview-layer-management
    relation: produces
    description: >-
      usePinReportVessels constructs and persists dataview instances through
      upsertDataviewInstance, populating the Redux dataviews slice
  - to: report-visualization-components
    relation: implements
    description: >-
      Provides pinVessels and unPinVessels callbacks that ReportVesselsTablePin
      and ReportVessels use for bulk vessel operations
generator:
  version: 1
covers:
  - symbol: usePopulateVesselResource
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts:L37-L64
  - symbol: populateVesselInfoResource
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts:L39-L62
  - symbol: usePinReportVessels
    kind: function
    at: >-
      apps/platform/features/_reports/shared/vessels/report-vessels.hooks.ts:L66-L166
---

<!-- context:generated:start -->

## Summary

Manages the workflow for adding vessels from reports to the workspace map view, fetching full vessel identity data, retrieving related track and event datasets, constructing dataview instances with colors, and persisting them through the Redux resources and dataviews slices. Enforces a hard limit of 50 pinned vessels.

## Related

- produces [[dataview-layer-management]] — usePinReportVessels constructs and persists dataview instances through upsertDataviewInstance, populating the Redux dataviews slice
- implements [[report-visualization-components]] — Provides pinVessels and unPinVessels callbacks that ReportVesselsTablePin and ReportVessels use for bulk vessel operations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
