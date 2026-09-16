---
name: Workspace utilities and validation
slug: workspace-utilities-and-validation
type: file
sources:
  - path: apps/platform/features/_map/workspace/workspace.utils.ts
    hash: 1cc0793169b6b7f2206585cccf27ae85c860dbd078695a72d66d3942f0da2852
sources_digest: 5a8161636efc7c8b5ddef8ce9db5693b75a1ad523b290f4b42852f45efa94662
links:
  - to: report-data-cleaning-utilities
    relation: depends_on
    description: >-
      Imports cleaners from report-dataview-cleaners to normalize report-related
      dataview configurations
  - to: workspace-state-orchestration-redux-slice-selectors
    relation: implements
    description: >-
      Provides transformation and validation logic used by workspace slice and
      selectors
  - to: workspace-user-interface-components
    relation: implements
    description: >-
      Supplies formatting and validation utilities consumed by workspace UI
      components
generator:
  version: 1
covers:
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

Pure utility functions for workspace data transformation, access-control labeling, color palette cycling, and report-payload cleaning. Provides parseUpsertWorkspace for API submission preparation, isPrivateWorkspaceNotAllowed for validation, getWorkspaceLabel for UI formatting with privacy/password icons, getNextColor for balanced visual diversity in dataviews, and cleanReportQuery/cleanReportPayload for stripping report-specific state before navigation or saving.

## Related

- depends on [[report-data-cleaning-utilities]] — Imports cleaners from report-dataview-cleaners to normalize report-related dataview configurations
- implements [[workspace-state-orchestration-redux-slice-selectors]] — Provides transformation and validation logic used by workspace slice and selectors
- implements [[workspace-user-interface-components]] — Supplies formatting and validation utilities consumed by workspace UI components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
