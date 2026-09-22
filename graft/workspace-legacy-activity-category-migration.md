---
name: Workspace Legacy Activity Category Migration
slug: workspace-legacy-activity-category-migration
type: file
sources:
  - path: apps/platform/features/_map/workspace/legacy-activity-category.hook.ts
    hash: 8db957a20d0fa2ff72fb7c5dc690f220aa30017f4acfcbc80579028f201f260d
sources_digest: 4679646dec236293046c39f2b871373d760758de7cca4f65b3e0dcc6968d1631
links:
  - to: dataview-instance-connector
    relation: uses
    description: >-
      Calls upsertDataviewInstance to mark dataviews invisible based on legacy
      category filtering rules
  - to: router-query-parameter-management
    relation: uses
    description: >-
      Uses useReplaceQueryParams to remove the deprecated activityCategory
      parameter from URL
  - to: workspace-and-dataview-state-selectors
    relation: depends_on
    description: >-
      Monitors selectActivityCategory and selectAllDataviewInstancesResolved
      Redux selectors to detect legacy parameter and retrieve dataview state
generator:
  version: 1
covers:
  - symbol: useHideLegacyActivityCategoryDataviews
    kind: function
    at: >-
      apps/platform/features/_map/workspace/legacy-activity-category.hook.ts:L16-L55
---

<!-- context:generated:start -->

## Summary

Manages migration away from a legacy URL parameter-driven activity category configuration by auto-hiding incompatible dataview instances and clearing the deprecated `activityCategory` query parameter. Uses a ref flag to ensure migration runs only once, preventing redundant updates.

## Related

- uses [[dataview-instance-connector]] — Calls upsertDataviewInstance to mark dataviews invisible based on legacy category filtering rules
- uses [[router-query-parameter-management]] — Uses useReplaceQueryParams to remove the deprecated activityCategory parameter from URL
- depends on [[workspace-and-dataview-state-selectors]] — Monitors selectActivityCategory and selectAllDataviewInstancesResolved Redux selectors to detect legacy parameter and retrieve dataview state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
