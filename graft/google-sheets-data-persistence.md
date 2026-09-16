---
name: Google Sheets Data Persistence
slug: google-sheets-data-persistence
type: concept
sources:
  - path: apps/platform/routes/api/corrections.ts
    hash: 925b8b8c8c3308370c85dd6aae36b50e223774f64932b51486881cfbb4b96a22
  - path: apps/platform/routes/api/downloadSurvey.ts
    hash: e7493dda075acdf2065b600ad9aa49b94b3e66157fb36bfeea8d937baed17fb4
  - path: apps/platform/routes/api/feedback.ts
    hash: d72e8fac48a22ac4a9fd29153eca193468af9afe0c343086ac58cd9cb59d2491
  - path: apps/platform/routes/api/track-corrections/$workspaceId/$issueId.ts
    hash: 88f62c76f2c14230b7fba89a9c4267840362f96633e2a915c79d44b9bde3736b
  - path: apps/platform/routes/api/track-corrections/$workspaceId/index.ts
    hash: fb945b9807a52fa77879047282112f22f2a60e2708ce4091e1a88ccb88e6248e
  - path: apps/platform/server/api/track-corrections/get-all.ts
    hash: f9be680beadefeec2306ef67088f9cc8e81c6414a02e5fd7fa2b7daf2cf53ea5
  - path: apps/platform/server/api/track-corrections/get-one.ts
    hash: b6f8774118b4b368fe3f100e6e3fb87002c22bf174c469c1a4091603e52ca283
  - path: apps/platform/server/api/track-corrections/post-comment.ts
    hash: 892f564c3d30b2743fb07c47fbc9ceec199c652a67dd9fdcf0a67f3713bf905b
  - path: apps/platform/server/api/track-corrections/post-new.ts
    hash: fee1b784ea13e69a11166d71c14a80548dd367ede7aca9f43aa8424aa72378f6
  - path: apps/platform/server/api/utils/sanitize.ts
    hash: c594105f5abdee7160bb8d71a3187d8f66ac28385fc525bc4e850ec2cfc00eff
sources_digest: bb42380602058c138982037a9075ec04e19e69c8733e906ec55676b718e89123
links:
  - to: google-sheets-api-integration
    relation: depends_on
    description: >-
      All Sheets operations use loadSpreadsheetDoc and
      loadSpreadsheetDocByWorkspace for authentication and sheet access
  - to: security-formula-injection-prevention
    relation: uses
    description: >-
      All user-supplied data written to Sheets is sanitized via
      sanitizeSheetValue and sanitizeSheetRow before row append
  - to: vessel-tracking-corrections-system
    relation: implements
    description: >-
      Track corrections are persisted via Sheets row operations with comment
      linkage through custom formulas
generator:
  version: 1
covers:
  - symbol: mapDataToHeader
    kind: function
    at: 'apps/platform/routes/api/corrections.ts:L12-L58'
  - symbol: ApiResponse
    kind: type
    at: 'apps/platform/routes/api/corrections.ts:L60-L64'
  - symbol: ApiResponse
    kind: type
    at: 'apps/platform/routes/api/downloadSurvey.ts:L8-L12'
  - symbol: FeedbackDataType
    kind: type
    at: 'apps/platform/routes/api/feedback.ts:L11-L11'
  - symbol: FeedbackForm
    kind: type
    at: 'apps/platform/routes/api/feedback.ts:L12-L29'
  - symbol: ApiResponse
    kind: type
    at: 'apps/platform/routes/api/feedback.ts:L31-L35'
  - symbol: ErrorAPIResponse
    kind: type
    at: 'apps/platform/routes/api/track-corrections/$workspaceId/$issueId.ts:L8-L11'
  - symbol: GetIssueDetailAPIResponse
    kind: type
    at: >-
      apps/platform/routes/api/track-corrections/$workspaceId/$issueId.ts:L13-L13
  - symbol: APIResponse
    kind: type
    at: >-
      apps/platform/routes/api/track-corrections/$workspaceId/$issueId.ts:L15-L15
  - symbol: ErrorAPIResponse
    kind: type
    at: 'apps/platform/routes/api/track-corrections/$workspaceId/index.ts:L8-L11'
  - symbol: CreateIssueAPIResponse
    kind: type
    at: 'apps/platform/routes/api/track-corrections/$workspaceId/index.ts:L13-L13'
  - symbol: GetAllIssuesAPIResponse
    kind: type
    at: 'apps/platform/routes/api/track-corrections/$workspaceId/index.ts:L14-L14'
  - symbol: APIResponse
    kind: type
    at: 'apps/platform/routes/api/track-corrections/$workspaceId/index.ts:L16-L16'
  - symbol: getWorkspaceIssues
    kind: function
    at: 'apps/platform/server/api/track-corrections/get-all.ts:L13-L51'
  - symbol: getWorkspaceIssueDetail
    kind: function
    at: 'apps/platform/server/api/track-corrections/get-one.ts:L13-L48'
  - symbol: addCommentToIssue
    kind: function
    at: 'apps/platform/server/api/track-corrections/post-comment.ts:L6-L20'
  - symbol: createNewIssue
    kind: function
    at: 'apps/platform/server/api/track-corrections/post-new.ts:L13-L42'
  - symbol: sanitizeSheetValue
    kind: function
    at: 'apps/platform/server/api/utils/sanitize.ts:L17-L22'
  - symbol: sanitizeSheetRow
    kind: function
    at: 'apps/platform/server/api/utils/sanitize.ts:L28-L34'
  - symbol: escapeFormulaString
    kind: function
    at: 'apps/platform/server/api/utils/sanitize.ts:L41-L43'
---

<!-- context:generated:start -->

## Summary

Design pattern where transient data (corrections, feedback, track issues, comments) is persisted to Google Sheets via row append operations rather than a traditional database. Rows are sanitized against formula-injection attacks, and all sheet operations assume required sheets and columns exist.

## Related

- depends on [[google-sheets-api-integration]] — All Sheets operations use loadSpreadsheetDoc and loadSpreadsheetDocByWorkspace for authentication and sheet access
- uses [[security-formula-injection-prevention]] — All user-supplied data written to Sheets is sanitized via sanitizeSheetValue and sanitizeSheetRow before row append
- implements [[vessel-tracking-corrections-system]] — Track corrections are persisted via Sheets row operations with comment linkage through custom formulas

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
