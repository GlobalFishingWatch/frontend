---
name: localStorage Persistence Pattern
slug: localstorage-persistence-pattern
type: concept
sources:
  - path: libs/timebar/src/utils/use-resizable-height.ts
    hash: 73b3ce322f0459723db9264617aaf898b1032caaa3b049de1323373490fc839e
  - path: libs/ui-components/src/color-bar/ColorBar.tsx
    hash: 77f5428554b3376b068a5e0d14475875665d93a59d00a041810d9bb357fc6567
  - path: libs/ui-components/src/download-survey/DownloadSurvey.tsx
    hash: 003a8b28314f2f5916da6ba4f01938bec3a078ee05d16b8cd4ca81d791682b72
sources_digest: 6b49a2b346aabbd7aa7b9222ecb9d437e0555b5276ffd2229e0ae8c2ef6540d7
links: []
generator:
  version: 1
covers:
  - symbol: getStoredHeight
    kind: function
    at: 'libs/timebar/src/utils/use-resizable-height.ts:L13-L21'
  - symbol: setStoredHeight
    kind: function
    at: 'libs/timebar/src/utils/use-resizable-height.ts:L23-L29'
  - symbol: useResizableHeight
    kind: function
    at: 'libs/timebar/src/utils/use-resizable-height.ts:L35-L87'
  - symbol: ColorBarProps
    kind: interface
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L17-L25'
  - symbol: ColorBar
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L27-L113'
  - symbol: toggleColorMode
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L48-L50'
  - symbol: handleHueBarSelection
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L52-L57'
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
---

<!-- context:generated:start -->

## Summary

Pattern for persisting user preferences to localStorage with graceful error handling and fallback defaults. Used in ColorBar (mode preference: swatches vs. hue-bar), DownloadSurvey (skip preference), and useResizableHeight (timebar height). All implementations wrap localStorage access in try-catch blocks to handle sandboxed iframes, disabled cookies, and storage quota exceeded errors, returning sensible defaults rather than crashing.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
