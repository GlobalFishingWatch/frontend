---
name: 'Security: CSRF Mitigation for Public APIs'
slug: security-csrf-mitigation-for-public-apis
type: concept
sources:
  - path: apps/platform/routes/api/corrections.ts
    hash: 925b8b8c8c3308370c85dd6aae36b50e223774f64932b51486881cfbb4b96a22
  - path: apps/platform/routes/api/downloadSurvey.ts
    hash: e7493dda075acdf2065b600ad9aa49b94b3e66157fb36bfeea8d937baed17fb4
  - path: apps/platform/routes/api/feedback.ts
    hash: d72e8fac48a22ac4a9fd29153eca193468af9afe0c343086ac58cd9cb59d2491
  - path: apps/platform/routes/api/track-corrections/$workspaceId/index.ts
    hash: fb945b9807a52fa77879047282112f22f2a60e2708ce4091e1a88ccb88e6248e
  - path: apps/platform/server/api/utils/request.ts
    hash: 931ff1998ba9bb3c250ae40fe50c8d22c9ab6e14f808f53f76133c61210faecb
sources_digest: 27051d83f82d1b11fb0926bdd10a1226dc2eb62cf6c4e0ce0aebc1bbda213e85
links: []
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
  - symbol: isSameOrigin
    kind: function
    at: 'apps/platform/server/api/utils/request.ts:L14-L24'
  - symbol: forbiddenResponse
    kind: function
    at: 'apps/platform/server/api/utils/request.ts:L26-L28'
---

<!-- context:generated:start -->

## Summary

Pattern for protecting guest-accessible POST endpoints (track corrections, feedback, surveys) without authentication by verifying same-origin via Origin/Referer headers and returning 403 on mismatch. Trades sophisticated CSRF protections for usability in public collection workflows.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
