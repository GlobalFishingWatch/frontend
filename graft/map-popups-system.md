---
name: Map Popups System
slug: map-popups-system
type: system
sources:
  - path: apps/platform/features/_map/map/popups/map-popups.utils.ts
    hash: deeeb79dfc75625839eb9b973ab64975a8c86c8c0a07126b5fed102b54febb9c
  - path: apps/platform/features/_map/map/popups/MapPopups.tsx
    hash: 79f076210b688b7a4f5e7dba514a6ea7298f00673310e4443e7e017aa4c34f15
  - path: apps/platform/features/_map/map/popups/PopupByCategory.tsx
    hash: 3d8d6d069712fbc51be6bb299703e55fdd7b376c857b0aaa7063a12b0fb19241
  - path: apps/platform/features/_map/map/popups/PopupWrapper.tsx
    hash: b034d77300909c0d0bff1a9ca9c149a96feda23fbbcc2d4e40f9c463701e003d
sources_digest: d13c34725c21a1677efd91156f43169d4868e39cf6c7e11f7fc1798f1918a9f9
links:
  - to: context-layer-tooltips
    relation: uses
    description: >-
      MapPopups delegates rendering of context and user-drawn layer features to
      ContextTooltipSection and UserContextTooltipSection
  - to: environmental-data-tooltips
    relation: uses
    description: >-
      PopupByCategory renders bathymetry, gridded values, and vector data via
      specialized tooltip sections
  - to: event-cluster-tooltips
    relation: uses
    description: >-
      PopupByCategory routes event-type features to event-specific tooltip row
      components
  - to: floating-ui-integration
    relation: depends_on
    description: >-
      PopupWrapper relies on Floating UI positioning middleware for
      viewport-aware popup placement
  - to: map-interaction-hooks
    relation: uses
    description: >-
      MapPopups and PopupWrapper depend on useClickedEventConnect and
      useMapHoverInteraction for state management
generator:
  version: 1
covers:
  - symbol: MapPopups
    kind: function
    at: 'apps/platform/features/_map/map/popups/MapPopups.tsx:L19-L75'
  - symbol: PopupByCategoryProps
    kind: type
    at: 'apps/platform/features/_map/map/popups/PopupByCategory.tsx:L71-L74'
  - symbol: PopupByCategory
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupByCategory.tsx:L78-L433'
  - symbol: getBoundary
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L26-L26'
  - symbol: OFF_MAP_RECT
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L27-L27'
  - symbol: PopupWrapperProps
    kind: type
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L29-L38'
  - symbol: PopupWrapper
    kind: function
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L40-L142'
  - symbol: apply
    kind: method
    at: 'apps/platform/features/_map/map/popups/PopupWrapper.tsx:L90-L92'
  - symbol: getCleanPropertiesList
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L17-L23'
  - symbol: parsePropertiesList
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L25-L38'
  - symbol: getContextValue
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L40-L55'
  - symbol: getContextLayerId
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L57-L64'
  - symbol: getUserContextLayerLabel
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L66-L100'
  - symbol: getIntervalDateFormat
    kind: function
    at: 'apps/platform/features/_map/map/popups/map-popups.utils.ts:L102-L106'
---

<!-- context:generated:start -->

## Summary

A comprehensive React system for rendering contextual information popups on deck.gl map interactions, handling both hover and click events. It orchestrates category-based dispatch to specialized tooltip components for vessels, activities, events, context layers, environmental data, and user-drawn content, integrating deeply with Redux for dataview metadata, interaction state, and UI configuration.

## Related

- uses [[context-layer-tooltips]] — MapPopups delegates rendering of context and user-drawn layer features to ContextTooltipSection and UserContextTooltipSection
- uses [[environmental-data-tooltips]] — PopupByCategory renders bathymetry, gridded values, and vector data via specialized tooltip sections
- uses [[event-cluster-tooltips]] — PopupByCategory routes event-type features to event-specific tooltip row components
- depends on [[floating-ui-integration]] — PopupWrapper relies on Floating UI positioning middleware for viewport-aware popup placement
- uses [[map-interaction-hooks]] — MapPopups and PopupWrapper depend on useClickedEventConnect and useMapHoverInteraction for state management

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
