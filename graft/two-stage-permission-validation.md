---
name: Two-Stage Permission Validation
slug: two-stage-permission-validation
type: concept
sources:
  - path: >-
      apps/platform/features/_map/map/popups/context/ContextLayerDownloadPopupButton.tsx
    hash: a59b47b51558fe25485f03df473352ded0e028fcf2e49e8c27d804ac04a9c630
sources_digest: 17ee3ca766af60dc81bd55c58354324822f552d44d943333ae7daf7efa917680
links:
  - to: context-layer-tooltips
    relation: part_of
    description: Permission validation is implemented in ContextLayerDownloadPopupButton
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
---

<!-- context:generated:start -->

## Summary

A permission checking pattern used by ContextLayerDownloadPopupButton where validation proceeds in two stages: first checking if the dataview/layer ID supports reporting via getIsDataviewReportSupported, then separately verifying user permission to download activity datasets via getActivityDatasetsReportSupported. Non-guest users see the button disabled if either check fails; guest users see it disabled regardless, with login deferred to LoginButtonWrapper.

## Related

- part of [[context-layer-tooltips]] — Permission validation is implemented in ContextLayerDownloadPopupButton

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
