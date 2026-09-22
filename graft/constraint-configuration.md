---
name: Constraint Configuration
slug: constraint-configuration
type: concept
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts
    hash: 038b2f2c1baafd6f2c826e82112a8c91a32b89fb03b1160afde8ac136dcfdb8d
  - path: apps/platform/features/_reports/tabs/activity/reports-activity.config.ts
    hash: 4d610299e61f054c70d4dc7409cfa53d77fd767e682abbb63e70c1b709cfa90d
sources_digest: 764677b3dfc48118e6fc9a9f34c92156af6f1f68a5dcc1094fd9fde8c79caf75
links:
  - to: time-comparison-state-management
    relation: configures
    description: >-
      Constraint constants are imported and enforced by
      useReportTimeCompareConnect hook during date/duration validation
generator:
  version: 1
covers:
  - symbol: useSetReportTimeComparison
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts:L26-L94
  - symbol: useReportTimeCompareConnect
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts:L96-L250
  - symbol: useTimeCompareTimeDescription
    kind: function
    at: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts:L252-L289
---

<!-- context:generated:start -->

## Summary

Hard limits for temporal range selection in comparison modes: MAX_DAYS_TO_COMPARE (100 days) and MAX_MONTHS_TO_COMPARE (12 months) prevent performance degradation and keep UI responsive. These thresholds are enforced in time comparison hooks when validating user input and are sourced from reports-activity.config as a single source of truth.

## Related

- configures [[time-comparison-state-management]] — Constraint constants are imported and enforced by useReportTimeCompareConnect hook during date/duration validation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
