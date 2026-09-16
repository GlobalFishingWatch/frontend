---
name: Dataview Instance Resolution Pipeline
slug: dataview-instance-resolution-pipeline
type: system
sources:
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.instances.selectors.ts
    hash: 295a3e15de1383ecf8888c0f3b0939f23af9edb72409d5c2f46620cd32d7f4df
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.merged.selectors.ts
    hash: 2d4f2dc61805197cd8d1c14a047a54245d8621a5e199bf1db3aa79fbed0b3f18
  - path: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.resolvers.selectors.ts
    hash: 4a19e93d2184ad0e784a6840bc59df17a0be676ae6d98b7515cc3ae2f519f105
sources_digest: 24fcb26640d1b52d094f1ea7f6f7305ab4ed6710646071d44cd29a29c79d49e0
links:
  - to: dataview-injection-context-aware-rendering
    relation: depends_on
    description: >-
      Resolver pipeline composes injected instances via
      selectDataviewInstancesInjected after merging with workspace instances in
      selectWorkspaceDataviewInstancesMerged.
  - to: dataview-type-category-selectors
    relation: produces
    description: >-
      Higher-order selectors like selectActiveDataviews and
      selectActiveReportDataviews derive from selectDataviewInstancesResolved to
      provide type-filtered and category-filtered views.
  - to: report-aware-dataview-filtering
    relation: produces
    description: >-
      selectDataviewInstancesResolved output feeds into report category
      extraction and visibility filtering selectors.
generator:
  version: 1
covers:
  - symbol: findVesselProfileDataviewInstance
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.instances.selectors.ts:L45-L67
  - symbol: selectDataviewInstancesByType
    kind: function
    at: >-
      apps/platform/features/_map/dataviews/selectors/dataviews.instances.selectors.ts:L194-L198
---

<!-- context:generated:start -->

## Summary

A multi-stage Redux selector chain that transforms raw dataview configuration (from workspace and URL) into fully resolved instances ready for map rendering. Stages include merging workspace and injected instances, applying URL ordering, resolving vessel-specific properties and dataset configs, enriching with ship names and event highlights, and filtering to context-aware visibility rules (by location type, report category, time mode).

## Related

- depends on [[dataview-injection-context-aware-rendering]] — Resolver pipeline composes injected instances via selectDataviewInstancesInjected after merging with workspace instances in selectWorkspaceDataviewInstancesMerged.
- produces [[dataview-type-category-selectors]] — Higher-order selectors like selectActiveDataviews and selectActiveReportDataviews derive from selectDataviewInstancesResolved to provide type-filtered and category-filtered views.
- produces [[report-aware-dataview-filtering]] — selectDataviewInstancesResolved output feeds into report category extraction and visibility filtering selectors.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
