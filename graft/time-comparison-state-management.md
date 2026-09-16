---
name: Time Comparison State Management
slug: time-comparison-state-management
type: system
sources:
  - path: >-
      apps/platform/features/_reports/tabs/activity/reports-activity-timecomparison.hooks.ts
    hash: 038b2f2c1baafd6f2c826e82112a8c91a32b89fb03b1160afde8ac136dcfdb8d
sources_digest: dac259a0df3d7884d9c66268badd75f297a4fda2f0fbd8c40960bdb4e457b8c7
links:
  - to: activity-report-redux-state
    relation: depends_on
    description: >-
      Hooks read selectReportTimeComparison and selectReportActivityGraph to
      access and validate current comparison state
  - to: constraint-configuration
    relation: depends_on
    description: >-
      Hooks enforce MAX_DAYS_TO_COMPARE (100) and MAX_MONTHS_TO_COMPARE (12)
      limits from reports-activity.config when validating user input
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

Custom React hooks managing time comparison configuration for activity reports, bridging Redux state, URL query parameters, and UI inputs. Provides event handlers for date/duration changes with validation against MAX_DAYS_TO_COMPARE and MAX_MONTHS_TO_COMPARE limits, automatic duration calculation based on timebar range, and human-readable period descriptions via i18n.

## Related

- depends on [[activity-report-redux-state]] — Hooks read selectReportTimeComparison and selectReportActivityGraph to access and validate current comparison state
- depends on [[constraint-configuration]] — Hooks enforce MAX_DAYS_TO_COMPARE (100) and MAX_MONTHS_TO_COMPARE (12) limits from reports-activity.config when validating user input

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
