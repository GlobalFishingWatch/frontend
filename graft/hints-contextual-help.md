---
name: Hints & Contextual Help
slug: hints-contextual-help
type: system
sources:
  - path: apps/platform/features/hints/Hint.tsx
    hash: 398bc843eb36aef36d75e1b6fa054def2ec65e5ad02965e0c5cf24e053eff00f
  - path: apps/platform/features/hints/hints.content.ts
    hash: 7614e2a1d3eeb2707a60e8b9f1571d3a6eb1a741f2077bf33f6355d5773ecd54
  - path: apps/platform/features/hints/hints.slice.ts
    hash: a464a7ea621f8019379143fa1429b6def271cedc4ac5907e92109014e69f1db2
sources_digest: e43734cbf71e96a23e78b57a0f1ce35f7cee7354485c6f953c57e8dccb199f7a
links:
  - to: analytics
    relation: uses
    description: >-
      Tracks hint visibility, toggle, and dismissal events separately for
      product insights
  - to: redux-state-management
    relation: uses
    description: >-
      Manages dismissal state via Redux slice with localStorage persistence;
      checks selectReadOnly and selectScreenshotMode selectors
  - to: shared-ui-components
    relation: uses
    description: >-
      Renders help icon bubbles and popovers via Popover and Button components
      from @globalfishingwatch/ui-components
  - to: user-guide-integration
    relation: uses
    description: >-
      Optionally links hint content to relevant user guide documentation via
      userGuideSlug references in hintsConfig
generator:
  version: 1
covers:
  - symbol: HintProps
    kind: type
    at: 'apps/platform/features/hints/Hint.tsx:L25-L28'
  - symbol: Hint
    kind: function
    at: 'apps/platform/features/hints/Hint.tsx:L30-L149'
  - symbol: onOpenChange
    kind: function
    at: 'apps/platform/features/hints/Hint.tsx:L70-L77'
  - symbol: HintId
    kind: type
    at: 'apps/platform/features/hints/hints.content.ts:L22-L29'
  - symbol: HintConfig
    kind: type
    at: 'apps/platform/features/hints/hints.content.ts:L31-L37'
  - symbol: HintsDismissed
    kind: type
    at: 'apps/platform/features/hints/hints.slice.ts:L10-L10'
  - symbol: HintsState
    kind: interface
    at: 'apps/platform/features/hints/hints.slice.ts:L12-L14'
  - symbol: selectHintsDismissed
    kind: function
    at: 'apps/platform/features/hints/hints.slice.ts:L50-L50'
---

<!-- context:generated:start -->

## Summary

Popover-based hint bubbles distributed throughout the platform UI that display informational content with optional images and links, managing dismissal state in Redux with localStorage persistence, and respecting read-only and screenshot modes.

## Related

- uses [[analytics]] — Tracks hint visibility, toggle, and dismissal events separately for product insights
- uses [[redux-state-management]] — Manages dismissal state via Redux slice with localStorage persistence; checks selectReadOnly and selectScreenshotMode selectors
- uses [[shared-ui-components]] — Renders help icon bubbles and popovers via Popover and Button components from @globalfishingwatch/ui-components
- uses [[user-guide-integration]] — Optionally links hint content to relevant user guide documentation via userGuideSlug references in hintsConfig

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
