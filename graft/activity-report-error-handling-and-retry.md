---
name: Activity Report Error Handling and Retry
slug: activity-report-error-handling-and-retry
type: concept
sources:
  - path: apps/platform/features/_reports/tabs/activity/ReportActivity.tsx
    hash: 43be9b5a89248ae8ce3265ff1be3add0cf92c83c19f0be22799e081e5073968f
sources_digest: c8d61bde82e4a4db0d58c1ffe373d7b390803b2b0d5c8f1068a8bd4389d80137
links:
  - to: activity-report-visualization
    relation: implements
    description: >-
      ReportActivity conditionally renders error placeholders or retry controls
      based on error type and state machine transitions
generator:
  version: 1
covers:
  - symbol: ActivityReport
    kind: function
    at: 'apps/platform/features/_reports/tabs/activity/ReportActivity.tsx:L67-L410'
---

<!-- context:generated:start -->

## Summary

A defensive error-handling strategy in ReportActivity that detects and recovers from multiple failure modes: authentication failures (WorkspaceLoginError), concurrent report conflicts (with 30-second polling retry), geometry complexity failures (413/422 status codes), timeout errors, and stale reports requiring refetch. Each error state has i18n messaging and analytics tracking, and concurrent conflicts reference last reports stored in local storage for recovery logic.

## Related

- implements [[activity-report-visualization]] — ReportActivity conditionally renders error placeholders or retry controls based on error type and state machine transitions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
