---
name: Map Control State
slug: map-control-state
type: file
sources:
  - path: apps/platform/features/_map/map/controls/map-controls.slice.ts
    hash: 569da426f69e80863035060512a9cc86f34f76d9ef2c008cdea45ad90b3a22f1
sources_digest: 13f703b7625722d696128f5128373e8361c633959b470a82982115d41fe4b104
links:
  - to: map-controls-system
    relation: implements
    description: >-
      Provides the state shape and actions consumed by map-controls.hooks.ts and
      MapControls.tsx components
generator:
  version: 1
covers:
  - symbol: MapControl
    kind: type
    at: 'apps/platform/features/_map/map/controls/map-controls.slice.ts:L13-L16'
  - symbol: MapControlValue
    kind: type
    at: 'apps/platform/features/_map/map/controls/map-controls.slice.ts:L17-L17'
  - symbol: MapControlState
    kind: type
    at: 'apps/platform/features/_map/map/controls/map-controls.slice.ts:L19-L22'
  - symbol: MapControlsSlice
    kind: type
    at: 'apps/platform/features/_map/map/controls/map-controls.slice.ts:L24-L28'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/_map/map/controls/map-controls.slice.ts:L100-L100'
  - symbol: selectMapControlEditing
    kind: function
    at: 'apps/platform/features/_map/map/controls/map-controls.slice.ts:L104-L107'
  - symbol: selectMapControlValue
    kind: function
    at: 'apps/platform/features/_map/map/controls/map-controls.slice.ts:L109-L113'
---

<!-- context:generated:start -->

## Summary

Redux slice managing editing state and data values for map controls (annotations, rulers, error notifications). Enforces mutual exclusivity—only one control can be edited at a time—and manages map search UI visibility via separate Redux actions and selectors.

## Related

- implements [[map-controls-system]] — Provides the state shape and actions consumed by map-controls.hooks.ts and MapControls.tsx components

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
