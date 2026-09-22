---
name: Tool Popups
slug: tool-popups
type: system
sources:
  - path: apps/platform/features/_map/map/popups/tools/HotspotTooltipSection.tsx
    hash: 0a04a761b3bca755dffb8bb7fe5cbd7de5ff42c6c35ae0ab6bc19b4511ed06d6
  - path: >-
      apps/platform/features/_map/map/popups/tools/ReportBufferTooltipSection.tsx
    hash: 9e2524023fea2fa9daaea96fd6e0db367fe41eea976510877fac9b227fd57819
  - path: apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx
    hash: 40bb7601a1fc92e94a4421bfcb995ca4871726a8495116e85afd874a17fb6941
  - path: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx
    hash: 9f10238a28fd2bda9248d36f9d295108abe36edd58dfb2e5cb76e03e2c16341a
sources_digest: 10875d8a467ee008b9a2b70919d9b336a222c16568c61b08de1b3a2418d27f90
links:
  - to: map-interaction-hooks
    relation: uses
    description: >-
      RulerTooltipSection and WorkspacePointsTooltipSection use
      useClickedEventConnect and useSetMapCoordinates
  - to: popup-layout-components
    relation: uses
    description: >-
      All tool tooltip sections use PopupSectionLayout for consistent
      presentation
generator:
  version: 1
covers:
  - symbol: HotspotTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/tools/HotspotTooltipSection.tsx:L10-L12
  - symbol: HotspotTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/HotspotTooltipSection.tsx:L14-L31
  - symbol: ReportBufferTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/tools/ReportBufferTooltipSection.tsx:L13-L15
  - symbol: ReportBufferTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/ReportBufferTooltipSection.tsx:L17-L23
  - symbol: RulerTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx:L13-L16
  - symbol: RulerTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx:L18-L48
  - symbol: onDeleteClick
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/RulerTooltipSection.tsx:L29-L34
  - symbol: WorkspacePointsTooltipSectionProps
    kind: type
    at: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx:L18-L21
  - symbol: WorkspacePointsTooltipSection
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx:L23-L92
  - symbol: WorkspaceLabel
    kind: function
    at: >-
      apps/platform/features/_map/map/popups/tools/WorkspacePointsTooltipSection.tsx:L40-L51
---

<!-- context:generated:start -->

## Summary

Components for rendering tooltips on tool-related map features: buffer zones (buffer color preview), rulers (length measurement with delete), workspace points (with navigation), and hotspots (area and activity statistics). Each tool tooltip follows the same PopupSectionLayout pattern with minimal customization per tool type.

## Related

- uses [[map-interaction-hooks]] — RulerTooltipSection and WorkspacePointsTooltipSection use useClickedEventConnect and useSetMapCoordinates
- uses [[popup-layout-components]] — All tool tooltip sections use PopupSectionLayout for consistent presentation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
