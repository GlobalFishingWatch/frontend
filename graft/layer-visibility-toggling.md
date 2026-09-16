---
name: Layer Visibility Toggling
slug: layer-visibility-toggling
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/LayerSwitch.tsx
    hash: 11822d8b30adcdb23d8299bdcc125eb0de393c3dd80fa389b0e3a3b42c792741
  - path: apps/platform/features/_map/workspace/shared/Title.tsx
    hash: 81668cefb3113b7d289017f4d0e8befbdad91d049deb7b0fe02d67356490764e
sources_digest: 5efa644f9048b20862ce9f274bcb59a867c9fd80763a75a8e22a83000446c72f
links:
  - to: analytics-and-user-event-tracking
    relation: uses
    description: >-
      useRefreshClickedEvent hook fires analytics events when visibility is
      toggled
  - to: workspace-dataview-instance-management
    relation: uses
    description: >-
      Both LayerSwitch and Title use upsertDataviewInstance from
      useDataviewInstancesConnect to persist visibility state
generator:
  version: 1
covers:
  - symbol: LayerSwitchProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L10-L18'
  - symbol: LayerSwitch
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L20-L57'
  - symbol: onToggleLayerActive
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/LayerSwitch.tsx:L33-L44'
  - symbol: TitleProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/Title.tsx:L15-L24'
  - symbol: Title
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/Title.tsx:L26-L76'
  - symbol: onToggleLayerActive
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/Title.tsx:L42-L55'
---

<!-- context:generated:start -->

## Summary

UI components (LayerSwitch, Title) and hooks that toggle visibility state of individual map layers, coordinating three side effects: updating dataview.config.visible in Redux, firing analytics refresh-clicked events, and calling optional parent callbacks. Visibility defaults to true if undefined.

## Related

- uses [[analytics-and-user-event-tracking]] — useRefreshClickedEvent hook fires analytics events when visibility is toggled
- uses [[workspace-dataview-instance-management]] — Both LayerSwitch and Title use upsertDataviewInstance from useDataviewInstancesConnect to persist visibility state

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
