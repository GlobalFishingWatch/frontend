---
name: Feedback & Bug Reporting
slug: feedback-bug-reporting
type: system
sources:
  - path: apps/platform/features/feedback/FeedbackModal.tsx
    hash: 0553464581b1ef98f4e4f98e0452443fe6bd442cfd8813bbe740211214fe5cf3
sources_digest: e96038283665362b50d652ef06b50eb1ab2ec86d7df54b96a522f3204d17d5c8
links:
  - to: redux-state-management
    relation: uses
    description: >-
      Accesses Redux selectors for active dataviews, user data, workspace state,
      and report information to populate feedback context
  - to: router
    relation: uses
    description: >-
      Uses getCurrentAppUrl to capture current navigation context and construct
      feedback artifact URLs
  - to: shared-ui-components
    relation: uses
    description: >-
      Renders form using Button, Modal, InputText, Select components from
      @globalfishingwatch/ui-components
  - to: workspace-report-management
    relation: uses
    description: >-
      Conditionally creates workspace or report artifacts for authenticated
      users via createWorkspaceThunk and createReportThunk
generator:
  version: 1
covers:
  - symbol: FeedbackModalProps
    kind: type
    at: 'apps/platform/features/feedback/FeedbackModal.tsx:L36-L39'
  - symbol: FeedbackData
    kind: type
    at: 'apps/platform/features/feedback/FeedbackModal.tsx:L41-L55'
  - symbol: FeedbackModal
    kind: function
    at: 'apps/platform/features/feedback/FeedbackModal.tsx:L82-L341'
  - symbol: setInitialFeedbackStateWithUserData
    kind: function
    at: 'apps/platform/features/feedback/FeedbackModal.tsx:L104-L116'
  - symbol: onFieldChange
    kind: function
    at: 'apps/platform/features/feedback/FeedbackModal.tsx:L162-L170'
  - symbol: sendFeedback
    kind: function
    at: 'apps/platform/features/feedback/FeedbackModal.tsx:L172-L249'
---

<!-- context:generated:start -->

## Summary

Modal interface for collecting user feedback about the platform, capturing user details, feedback type, and descriptions with automatic context about the current workspace or report. For authenticated users, automatically creates and associates workspace or report artifacts with submissions.

## Related

- uses [[redux-state-management]] — Accesses Redux selectors for active dataviews, user data, workspace state, and report information to populate feedback context
- uses [[router]] — Uses getCurrentAppUrl to capture current navigation context and construct feedback artifact URLs
- uses [[shared-ui-components]] — Renders form using Button, Modal, InputText, Select components from @globalfishingwatch/ui-components
- uses [[workspace-report-management]] — Conditionally creates workspace or report artifacts for authenticated users via createWorkspaceThunk and createReportThunk

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
