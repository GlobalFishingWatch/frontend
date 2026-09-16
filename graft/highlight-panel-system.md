---
name: Highlight Panel System
slug: highlight-panel-system
type: system
sources:
  - path: >-
      apps/platform/features/_map/workspace/highlight-panel/highlight-panel.content.ts
    hash: f10bc4fff90d225671d4fbe9bed3c5c82b62bf35b240151066a5f5c28c707668
  - path: apps/platform/features/_map/workspace/highlight-panel/HighlightPanel.tsx
    hash: 56039d0acb2887cafd59d74dc3258880c95958dda1d194d6ae88f3a904f855fc
sources_digest: 5c74f030309f7f102e9f84ff1903321516e797d85d936ad398d61fdb9bc9a475
links:
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Selects selectIsMapLoaded to determine when highlight panel can safely
      appear
generator:
  version: 1
covers:
  - symbol: HighlightPanelProps
    kind: type
    at: >-
      apps/platform/features/_map/workspace/highlight-panel/HighlightPanel.tsx:L20-L24
  - symbol: HighlightPanel
    kind: function
    at: >-
      apps/platform/features/_map/workspace/highlight-panel/HighlightPanel.tsx:L26-L120
  - symbol: onDismiss
    kind: function
    at: >-
      apps/platform/features/_map/workspace/highlight-panel/HighlightPanel.tsx:L62-L65
  - symbol: HighlighPanelConfigLocale
    kind: type
    at: >-
      apps/platform/features/_map/workspace/highlight-panel/highlight-panel.content.ts:L6-L12
  - symbol: HighlightPanelConfig
    kind: type
    at: >-
      apps/platform/features/_map/workspace/highlight-panel/highlight-panel.content.ts:L14-L22
---

<!-- context:generated:start -->

## Summary

Displays informational popovers for announcing new features/dataviews in the map workspace, persisted via localStorage dismissal. highlight-panel.content.ts defines HighlightPanelConfig type (dataview ID, storage key, image URL, release timestamp) and HIGHLIGHT_CONFIGS array. A selector function chooses the active config based on environment flags (IS_PRODUCTION_BUILD, IS_PRODUCTION_WORKSPACE_ENV) and release timestamps: only shows new highlights in production after their scheduled release. HighlightPanel.tsx renders Popover with image, title, description, and action buttons using locale-specific content (defaulting to English). Component only renders when map is loaded, dataview ID matches config, and user hasn't dismissed it. Hides entirely in screenshot mode.

## Related

- depends on [[workspace-redux-state]] — Selects selectIsMapLoaded to determine when highlight panel can safely appear

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
