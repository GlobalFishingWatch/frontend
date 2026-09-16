---
name: Timebar Settings Component
slug: timebar-settings-component
type: file
sources:
  - path: apps/platform/features/_map/timebar/TimebarSettings.tsx
    hash: 874856a6a63f5171ad1eb8f4c4f5b63e4cad16d55a5c2ea6bef5bd5ba15ef787
sources_digest: d288d217d9edb3e6879a5166a2bee570c4c829d32596500c21044b351b90c8b1
links:
  - to: time-range-management
    relation: uses
    description: >-
      Integration point for timebar settings affecting visualization mode and
      time range
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Selects active dataviews and visualization state to populate radio options
      and determine enabled states
generator:
  version: 1
covers:
  - symbol: Icon
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L43-L67'
  - symbol: TimebarSettings
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L69-L384'
  - symbol: openOptions
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L92-L99'
  - symbol: closeOptions
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L100-L102'
  - symbol: setTimebarSectionActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L104-L111'
  - symbol: setEnvironmentActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L113-L121'
  - symbol: setUserPointsActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L122-L130'
  - symbol: setVesselGroupActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L132-L140'
  - symbol: setVesselActive
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L141-L149'
  - symbol: setVesselGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L151-L159'
  - symbol: getVesselGraphTooltip
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarSettings.tsx:L161-L179'
---

<!-- context:generated:start -->

## Summary

Renders a collapsible settings panel for configuring what data visualization appears in the timebar (vessel tracks, activity heatmaps, environmental data, maritime metrics). Surfaces radio-button options for visualization type, environmental dataview selection, and graph type (speed/depth overlay for vessels) via Redux selectors (selectActiveActivityDataviews, selectActiveDetectionsDataviews, selectActiveTrackDataviews, selectActiveHeatmapEnvironmentalDataviewsWithoutStatic). State managed through useTimebarVisualisationConnect, useTimebarEnvironmentConnect, useTimebarGraphConnect hooks. Conditionally disables/hides options based on data presence (e.g., track graphs disabled if fewer than one or more than two vessel layers). Uses useClickedOutside to close panel and provides contextual tooltips explaining disabled states.

## Related

- uses [[time-range-management]] — Integration point for timebar settings affecting visualization mode and time range
- depends on [[workspace-redux-state]] — Selects active dataviews and visualization state to populate radio options and determine enabled states

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
