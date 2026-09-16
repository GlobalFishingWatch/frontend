---
name: Public Data Collection APIs
slug: public-data-collection-apis
type: system
sources:
  - path: apps/platform/routes/api/corrections.ts
    hash: 925b8b8c8c3308370c85dd6aae36b50e223774f64932b51486881cfbb4b96a22
  - path: apps/platform/routes/api/downloadSurvey.ts
    hash: e7493dda075acdf2065b600ad9aa49b94b3e66157fb36bfeea8d937baed17fb4
  - path: apps/platform/routes/api/feedback.ts
    hash: d72e8fac48a22ac4a9fd29153eca193468af9afe0c343086ac58cd9cb59d2491
sources_digest: 0d03f58da45ff309a7bdd118e932503795ee3f1b2dd747c8f52a64c7f0bbcb65
links:
  - to: google-sheets-data-persistence
    relation: uses
    description: All endpoints persist submissions to Google Sheets via row append
  - to: security-csrf-mitigation-for-public-apis
    relation: uses
    description: Each endpoint validates same-origin before accepting submissions
  - to: security-formula-injection-prevention
    relation: uses
    description: User data is sanitized before row insertion to prevent formula breakout
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
---

<!-- context:generated:start -->

## Summary

Guest-accessible POST endpoints for collecting user feedback, error reports, vessel corrections, and survey responses without authentication. Each endpoint appends a row to a workspace-specific Google Sheet, with origin validation and data sanitization.

## Related

- uses [[google-sheets-data-persistence]] — All endpoints persist submissions to Google Sheets via row append
- uses [[security-csrf-mitigation-for-public-apis]] — Each endpoint validates same-origin before accepting submissions
- uses [[security-formula-injection-prevention]] — User data is sanitized before row insertion to prevent formula breakout

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
