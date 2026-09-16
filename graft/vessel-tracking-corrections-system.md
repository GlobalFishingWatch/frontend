---
name: Vessel Tracking & Corrections System
slug: vessel-tracking-corrections-system
type: system
sources:
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
  - path: apps/platform/server/api/track-corrections/utils.ts
    hash: e954307a173535a4953ba09533c6d6d90ecba54ae8cd21d87133e31530362fa4
sources_digest: 4d5b675fcad43e18034566a0c51899bad407b9977640f7da38527beecb73c06e
links:
  - to: google-sheets-data-persistence
    relation: uses
    description: >-
      All issue and comment CRUD operations delegate to Google Sheets row
      append/query
  - to: security-csrf-mitigation-for-public-apis
    relation: uses
    description: >-
      POST endpoints validate same-origin via forbiddenResponse to prevent
      unauthorized submissions
  - to: track-correction-data-model
    relation: implements
    description: >-
      Utils functions parse Sheets rows into TrackCorrection and
      TrackCorrectionComment typed objects
generator:
  version: 1
covers:
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
  - symbol: parseIssueResolved
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L11-L13'
  - symbol: parseIssueComment
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L15-L30'
  - symbol: parseIssueRow
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L32-L50'
  - symbol: getSheetTab
    kind: function
    at: 'apps/platform/server/api/track-corrections/utils.ts:L52-L58'
---

<!-- context:generated:start -->

## Summary

Backend API for managing vessel tracking corrections and issues within workspaces. Stores issues and associated comments in Google Sheets per-workspace, supports listing, detail retrieval, and comment posting via separate API endpoints.

## Related

- uses [[google-sheets-data-persistence]] — All issue and comment CRUD operations delegate to Google Sheets row append/query
- uses [[security-csrf-mitigation-for-public-apis]] — POST endpoints validate same-origin via forbiddenResponse to prevent unauthorized submissions
- implements [[track-correction-data-model]] — Utils functions parse Sheets rows into TrackCorrection and TrackCorrectionComment typed objects

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
