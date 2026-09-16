---
name: Tiered configuration fallback pattern
slug: tiered-configuration-fallback-pattern
type: concept
sources:
  - path: apps/platform/features/_map/workspace/workspace.selectors.ts
    hash: 764cd830fe761c9b6561437cd988064c9d2ca667fec9a64ee15f92f8731272a9
  - path: apps/platform/features/_map/workspace/workspace.utils.ts
    hash: 1cc0793169b6b7f2206585cccf27ae85c860dbd078695a72d66d3942f0da2852
  - path: >-
      apps/platform/features/_reports/report-area/area-reports.buffer.selectors.ts
    hash: f9ab53669b8403ef18ec533e10397625c28595bad856767e013ec88139711fe0
sources_digest: 21c03d32a6c0e455e4aa18b7d4a122695354dac4d9c710faee37ef54d4d15208
links:
  - to: area-reports-system-core-logic-selectors
    relation: implements
    description: Buffer configuration fallback pattern is central to area report selectors
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: implements
    description: >-
      Workspace selectors implement multi-level fallback for configuration
      resolution
generator:
  version: 1
covers:
  - symbol: selectWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L47-L47'
  - symbol: selectWorkspaceReportId
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L48-L48'
  - symbol: selectWorkspacePassword
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L49-L49'
  - symbol: selectSuggestWorkspaceSave
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L50-L50'
  - symbol: selectWorkspaceError
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L51-L51'
  - symbol: selectWorkspaceStatus
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L52-L52'
  - symbol: selectWorkspaceRefreshStatus
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L53-L53'
  - symbol: selectIsWorkspaceRefreshing
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L54-L55'
  - symbol: selectWorkspaceHistoryNavigation
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L56-L57'
  - symbol: selectWorkspaceCustomStatus
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L58-L58'
  - symbol: isWorkspacePasswordProtected
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L144-L153'
  - symbol: WorkspaceProperty
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L194-L194'
  - symbol: selectWorkspaceStateProperty
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L201-L213'
  - symbol: WorkspaceFetchParams
    kind: type
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L237-L237'
  - symbol: getDefaultWorkspaceFetchParams
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L239-L246'
  - symbol: getReportWorkspaceFetchNeeded
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.selectors.ts:L248-L257'
  - symbol: parseUpsertWorkspace
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L22-L28'
  - symbol: isPrivateWorkspaceNotAllowed
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L30-L37'
  - symbol: getWorkspaceLabel
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L39-L46'
  - symbol: getNextColor
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L48-L64'
  - symbol: cleanReportQuery
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L66-L84'
  - symbol: cleanReportPayload
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L91-L95'
  - symbol: getWorkspaceReport
    kind: function
    at: 'apps/platform/features/_map/workspace/workspace.utils.ts:L97-L103'
---

<!-- context:generated:start -->

## Summary

Cross-cutting invariant: workspace configuration (buffer settings, viewport, time ranges) is resolved by cascading through multiple sources in order of precedence: URL query parameters → workspace state → user settings → defaults. This pattern centralizes configuration logic in selectors (selectWorkspaceStateProperty, selectReportBufferValue) and ensures changes at one level can be overridden without modifying saved state. Buffer configuration in particular uses workspace-first fallback to prevent workspace state from being shadowed by URL parameters, but allows URL to override workspace when needed.

## Related

- implements [[area-reports-system-core-logic-selectors]] — Buffer configuration fallback pattern is central to area report selectors
- implements [[workspace-state-orchestration-redux-slice-selectors]] — Workspace selectors implement multi-level fallback for configuration resolution

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
