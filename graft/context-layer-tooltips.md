---
name: Context Layer Tooltips
slug: context-layer-tooltips
type: system
sources:
  - path: >-
      apps/platform/features/_map/map/popups/context/ContextLayerDownloadPopupButton.tsx
    hash: a59b47b51558fe25485f03df473352ded0e028fcf2e49e8c27d804ac04a9c630
  - path: apps/platform/features/_map/map/popups/context/ContextLayerReportLink.tsx
    hash: 0e63f90d703516347249e8241c55eca377f7ffc5d17f5e98e03cc43b85ed01e3
  - path: apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts
    hash: 85eb5ab12525fe0dd01d2a27503e08d532c717c54c46e9659f48a8e44a671747
  - path: apps/platform/features/_map/map/popups/context/ContextLayerSparkline.tsx
    hash: e7141b04f22bc33eeabb991d7a16e10317141c3e0a483d41f35ee75e30c6058f
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx
    hash: bf2a3df480d75a08aa247c4fb238389c6d377ff66c0c341eaae110bc612bab4d
  - path: apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx
    hash: 00a19460456bfdaf3e5d29dc6fa40dd500036b6a2d1a9aa728193e84d947d3fb
  - path: apps/platform/features/_map/map/popups/context/PortsTooltipSection.tsx
    hash: 62ddb90702f76cb358bbdbd6b17ae98b936cc04fab10ee362eb7155b3b19b499
  - path: apps/platform/features/_map/map/popups/user/UserContextTooltipSection.tsx
    hash: 2c7b263462d39150f5bf2c29c1a2dc17381a5b0f50ec340f7e9a26bfa5783f66
sources_digest: f1a23d79af62f01a1a728da192e595779dd738a2bf5b9f712be0cb3186c7edc8
links:
  - to: area-interaction-hooks
    relation: uses
    description: >-
      ContextTooltipSection and UserContextTooltipSection use
      useContextInteractions and useAreaRowExpansion for state management
  - to: area-timeseries-hooks
    relation: uses
    description: >-
      ContextLayerSparkline and ContextTooltipRow delegate timeseries data
      fetching to useAreaTooltipTimeseries hook
  - to: feature-property-extraction
    relation: implements
    description: >-
      ContextLayers.hooks relies on getAreaIdFromFeature to extract identifiers
      from deck-layers picking objects
  - to: popup-layout-components
    relation: uses
    description: >-
      All context tooltip components use PopupSectionLayout for consistent
      styling and presentation
  - to: two-stage-permission-validation
    relation: implements
    description: >-
      ContextLayerDownloadPopupButton enforces dataview report support check
      followed by activity dataset permission verification
generator:
  version: 1
covers:
  - symbol: ContextLayerDownloadPopupButtonProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayerDownloadPopupButton.tsx:L16-L20
  - symbol: ContextLayerDownloadPopupButton
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayerDownloadPopupButton.tsx:L22-L58
  - symbol: ContextLayerReportLinkProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayerReportLink.tsx:L31-L40
  - symbol: ContextLayerReportLink
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayerReportLink.tsx:L42-L183
  - symbol: onReportClick
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayerReportLink.tsx:L81-L91
  - symbol: ContextLayerSparkline
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayerSparkline.tsx:L15-L60
  - symbol: getAreaIdFromFeature
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts:L20-L27
  - symbol: useContextInteractions
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextLayers.hooks.ts:L29-L101
  - symbol: ContextTooltipRowProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L24-L41
  - symbol: ContextTooltipRow
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipRow.tsx:L43-L187
  - symbol: ContextTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx:L19-L22
  - symbol: ContextTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/ContextTooltipSection.tsx:L24-L96
  - symbol: PortsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/context/PortsTooltipSection.tsx:L17-L20
  - symbol: PortsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/context/PortsTooltipSection.tsx:L22-L67
  - symbol: UserContextTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/user/UserContextTooltipSection.tsx:L17-L20
  - symbol: UserContextTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/user/UserContextTooltipSection.tsx:L22-L70
---

<!-- context:generated:start -->

## Summary

A subsystem for rendering interactive tooltips on context and user-defined map layer features, providing download, reporting, and timeseries visualization capabilities. Features are grouped by layer, with expansion support, permission-based button visibility, and analytics tracking for user interactions like downloads and report creation.

## Related

- uses [[area-interaction-hooks]] — ContextTooltipSection and UserContextTooltipSection use useContextInteractions and useAreaRowExpansion for state management
- uses [[area-timeseries-hooks]] — ContextLayerSparkline and ContextTooltipRow delegate timeseries data fetching to useAreaTooltipTimeseries hook
- implements [[feature-property-extraction]] — ContextLayers.hooks relies on getAreaIdFromFeature to extract identifiers from deck-layers picking objects
- uses [[popup-layout-components]] — All context tooltip components use PopupSectionLayout for consistent styling and presentation
- implements [[two-stage-permission-validation]] — ContextLayerDownloadPopupButton enforces dataview report support check followed by activity dataset permission verification

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
