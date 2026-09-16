---
name: Download Survey Component
slug: download-survey-component
type: system
sources:
  - path: libs/ui-components/src/download-survey/DownloadSurvey.tsx
    hash: 003a8b28314f2f5916da6ba4f01938bec3a078ee05d16b8cd4ca81d791682b72
  - path: libs/ui-components/src/download-survey/downloadSurvey.utils.ts
    hash: cd09489861b19f31cd43ff35bac12b28a2c84e0cb91a211f640bac84b73eb1ca
  - path: libs/ui-components/src/download-survey/index.ts
    hash: 2ccee1f60cd40688211fca81997c5568f76b5b3e7ea84a5c4dbc617d1c24044f
sources_digest: 1b1f56290a3e6d73d168ee1afbe766e947784dd11dd6669e87ce6c8d6ff3c042
links:
  - to: button-interactive-controls
    relation: uses
    description: DownloadSurvey integrates Button component for skip/send actions
generator:
  version: 1
covers:
  - symbol: DownloadSurveyContactConsent
    kind: type
    at: 'libs/ui-components/src/download-survey/DownloadSurvey.tsx:L15-L15'
  - symbol: DownloadSurveyAnswer
    kind: type
    at: 'libs/ui-components/src/download-survey/DownloadSurvey.tsx:L17-L20'
  - symbol: DownloadSurveyLabels
    kind: type
    at: 'libs/ui-components/src/download-survey/DownloadSurvey.tsx:L22-L36'
  - symbol: DownloadSurveyProps
    kind: type
    at: 'libs/ui-components/src/download-survey/DownloadSurvey.tsx:L55-L65'
  - symbol: DownloadSurvey
    kind: function
    at: 'libs/ui-components/src/download-survey/DownloadSurvey.tsx:L67-L185'
  - symbol: DownloadSurveyPayload
    kind: type
    at: 'libs/ui-components/src/download-survey/downloadSurvey.utils.ts:L5-L13'
  - symbol: SubmitDownloadSurveyParams
    kind: type
    at: 'libs/ui-components/src/download-survey/downloadSurvey.utils.ts:L15-L20'
  - symbol: submitDownloadSurvey
    kind: function
    at: 'libs/ui-components/src/download-survey/downloadSurvey.utils.ts:L22-L47'
---

<!-- context:generated:start -->

## Summary

Modal component for collecting user feedback during file downloads, managing multi-stage form state (form display, loading, success, error) with persistent skip preference via localStorage. Enforces non-empty usageIntent before submission, collects contact consent, and integrates Button, Choice, TextArea, and Spinner components for UI layout.

## Related

- uses [[button-interactive-controls]] — DownloadSurvey integrates Button component for skip/send actions

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
