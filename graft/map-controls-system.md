---
name: Map Controls System
slug: map-controls-system
type: system
sources:
  - path: apps/platform/features/_map/map/controls/AnnotationsControl.tsx
    hash: 013c89b552aade0409fa76dd782a8d019044e57d5d84b739bafb0fcd4cc8b252
  - path: apps/platform/features/_map/map/controls/map-controls.hooks.ts
    hash: e7a31f2982c875c09b1c5aa11dc2af16f79178c1e579bf18c543ca3a7f78aaab
  - path: apps/platform/features/_map/map/controls/map-controls.slice.ts
    hash: 569da426f69e80863035060512a9cc86f34f76d9ef2c008cdea45ad90b3a22f1
  - path: apps/platform/features/_map/map/controls/MapControlGroup.tsx
    hash: 1692ba2de40b400f71f463f60d8781c50d5e40f3214d5e3ac5b3076c17bc0e38
  - path: apps/platform/features/_map/map/controls/MapControls.tsx
    hash: 35b7fd683e627f93cd5a9c398cc3532d733bc18538e4fe74766d224dbcae0b7a
  - path: apps/platform/features/_map/map/controls/MapControlScreenshot.tsx
    hash: 2c3a9160ce0630b42fcf6f7941881f4984a410500935ebbe8066cccbbde31414
  - path: apps/platform/features/_map/map/controls/MapInfo.tsx
    hash: 8b6b326824ff88605c88aa0011275753bf29b5f77c429e8b4446780f39dcf156
  - path: apps/platform/features/_map/map/controls/MapScaleControl.tsx
    hash: e251f3a09f44534f2e6386afaaf1966987312f1efb006f7a4ae85e8aa5c022af
  - path: apps/platform/features/_map/map/controls/MapSearch.tsx
    hash: e5664efb8d6bf474434bc5e2514af5eed388a145f604d080b3bbcee82f3392f2
  - path: apps/platform/features/_map/map/controls/MiniGlobeInfo.tsx
    hash: 7136252372352adf2ae3342c1e6318d8c6a2eaf37980b28d02d68f5b3924bdef
  - path: apps/platform/features/_map/map/controls/ReferenceLayersControl.tsx
    hash: bfab3b0fd74ea90fe56508ea0b18b0c8699c7eb091e7580cd1223a48cb2b8bc7
  - path: apps/platform/features/_map/map/controls/ReportControl.tsx
    hash: 5e604aba3259d9ca78d0326690d3b320c08e2ff780ee22d673c70c079cc0ff9a
  - path: apps/platform/features/_map/map/controls/RulersControl.tsx
    hash: 6642709bac55e1bde3cb430facaa32f08bca02de1a68f09da1b3fa4947cc6bf9
  - path: apps/platform/features/_map/map/controls/TimelineDatesRange.tsx
    hash: fe07fced01f179b0778d92da84258492661a4888838a459de038c78bcebf9e61
  - path: apps/platform/features/_map/map/controls/TimeRangeDates.tsx
    hash: 5ffd80b95d8e12e6448497e7706334687d02401e636a4d62fc042f83f4f43e91
sources_digest: 845f6c63c3c2fcbc83aee0c50f77543a29dc3336984df0fd8ab6531b64d71903
links:
  - to: dataview-state-management
    relation: uses
    description: >-
      Upsets dataview instances (e.g., basemap switching) and reads
      context/report area dataview definitions
  - to: map-control-state
    relation: uses
    description: >-
      Uses Redux slice and hooks to manage editing mode, visibility, and values
      for individual controls like annotations and rulers
  - to: map-layers
    relation: depends_on
    description: >-
      Aggregates loading state from deck layer composition to disable controls
      during rendering
  - to: map-overlays-annotations-rulers
    relation: uses
    description: >-
      Provides UI controls that dispatch actions to manage annotation and ruler
      state stored in separate overlays modules
  - to: map-viewport-management
    relation: uses
    description: >-
      Integrates with viewport hooks to adjust zoom, pan, fit bounds, and
      display coordinate/scale information
generator:
  version: 1
covers:
  - symbol: MapAnnotationsControls
    kind: function
    at: 'apps/platform/features/_map/map/controls/AnnotationsControl.tsx:L10-L46'
  - symbol: MapControlGroupProps
    kind: type
    at: 'apps/platform/features/_map/map/controls/MapControlGroup.tsx:L9-L20'
  - symbol: MapControlGroup
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapControlGroup.tsx:L22-L70'
  - symbol: ScrenshotDOMArea
    kind: type
    at: 'apps/platform/features/_map/map/controls/MapControlScreenshot.tsx:L27-L27'
  - symbol: MapControlScreenshot
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapControlScreenshot.tsx:L29-L161'
  - symbol: MapControls
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapControls.tsx:L48-L220'
  - symbol: MapInfo
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapInfo.tsx:L14-L36'
  - symbol: ScaleControlProps
    kind: type
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L12-L14'
  - symbol: getDecimalRoundNum
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L16-L19'
  - symbol: getRoundNum
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L21-L28'
  - symbol: ScaleUnit
    kind: type
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L30-L30'
  - symbol: MapScaleControl
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L37-L71'
  - symbol: toggleMeasurement
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapScaleControl.tsx:L46-L48'
  - symbol: MapSearch
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L34-L220'
  - symbol: onSelectResult
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L50-L89'
  - symbol: onInputChange
    kind: function
    at: 'apps/platform/features/_map/map/controls/MapSearch.tsx:L91-L108'
  - symbol: MiniGlobeInfo
    kind: function
    at: 'apps/platform/features/_map/map/controls/MiniGlobeInfo.tsx:L13-L53'
  - symbol: updateAreaName
    kind: function
    at: 'apps/platform/features/_map/map/controls/MiniGlobeInfo.tsx:L20-L36'
  - symbol: ReferenceLayer
    kind: type
    at: >-
      apps/platform/features/_map/map/controls/ReferenceLayersControl.tsx:L20-L26
  - symbol: ReferenceLayersControl
    kind: function
    at: >-
      apps/platform/features/_map/map/controls/ReferenceLayersControl.tsx:L28-L118
  - symbol: ReportControls
    kind: function
    at: 'apps/platform/features/_map/map/controls/ReportControl.tsx:L14-L39'
  - symbol: Rulers
    kind: function
    at: 'apps/platform/features/_map/map/controls/RulersControl.tsx:L7-L42'
  - symbol: TimeRangeDates
    kind: function
    at: 'apps/platform/features/_map/map/controls/TimeRangeDates.tsx:L7-L24'
  - symbol: TimelineDatesRange
    kind: function
    at: 'apps/platform/features/_map/map/controls/TimelineDatesRange.tsx:L7-L16'
  - symbol: useMapControl
    kind: function
    at: 'apps/platform/features/_map/map/controls/map-controls.hooks.ts:L15-L52'
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

A collection of interactive map toolbar components providing zoom, basemap switching, search, measurement (rulers), annotations, screenshots, coordinate display, and reference layer toggling. Controls coordinate through Redux state, dispatch loading state aggregation during async operations, and lazily load heavy children via code-splitting for performance.

## Related

- uses [[dataview-state-management]] — Upsets dataview instances (e.g., basemap switching) and reads context/report area dataview definitions
- uses [[map-control-state]] — Uses Redux slice and hooks to manage editing mode, visibility, and values for individual controls like annotations and rulers
- depends on [[map-layers]] — Aggregates loading state from deck layer composition to disable controls during rendering
- uses [[map-overlays-annotations-rulers]] — Provides UI controls that dispatch actions to manage annotation and ruler state stored in separate overlays modules
- uses [[map-viewport-management]] — Integrates with viewport hooks to adjust zoom, pan, fit bounds, and display coordinate/scale information

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
