---
name: Modal State Management
slug: modal-state-management
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.hooks.ts
    hash: bc35e089f8d25bf1bf6e7d1b5452e512f66506fc3d0e64f3ea8d473609d787d6
  - path: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportTitle.tsx
    hash: 506920e24ebd948b0b0670ab0ed5c98fbe10a74323cd0f60ddc7b14f69b7cdd3
sources_digest: 7e7a0412d25e24ae8efa8a75cbbada2c65e9e409c3f21ca8fe3e8a4393655a5d
links:
  - to: vessel-group-report-feature
    relation: implements
    description: Provides modal state interface consumed by title component and edit hooks
generator:
  version: 1
covers:
  - symbol: VesselGroupReportTitle
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/VesselGroupReportTitle.tsx:L42-L174
  - symbol: useFetchVesselGroupReport
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.hooks.ts:L14-L31
  - symbol: useEditVesselGroupModal
    kind: function
    at: >-
      apps/platform/features/_reports/report-vessel-group/vessel-group-report.hooks.ts:L33-L46
---

<!-- context:generated:start -->

## Summary

Redux slice and actions (setVesselGroupEditId, setVesselGroupsModalOpen, setVesselGroupConfirmationMode) orchestrating modal UI lifecycle for vessel group editing. Used by report title and hooks to trigger edit workflows.

## Related

- implements [[vessel-group-report-feature]] — Provides modal state interface consumed by title component and edit hooks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
