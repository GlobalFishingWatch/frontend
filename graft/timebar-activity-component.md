---
name: Timebar Activity Component
slug: timebar-activity-component
type: file
sources:
  - path: apps/platform/features/_map/timebar/TimebarActivityGraph.tsx
    hash: d4acb42ef57588c830cdea67038a0b266e2337e21e5d8620ca631cb53b8b92ca
sources_digest: 99164e1282ba97e0a74dec8c5d1655fd231af95220166fe9f72389fcfacaeb8a
links:
  - to: timebar-activity-hook
    relation: uses
    description: >-
      Consumes useHeatmapActivityGraph to fetch heatmapActivity, colorScale,
      loading state, and dataviews
  - to: timebar-library-integration
    relation: uses
    description: >-
      Renders Timebar.Charts.StackedActivity component with activity data, color
      scaling, and tooltip callbacks
generator:
  version: 1
covers:
  - symbol: TimebarActivityGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarActivityGraph.tsx:L11-L56'
---

<!-- context:generated:start -->

## Summary

React component that renders a stacked activity chart in the timebar, visualizing fishing/environmental activity over time. Wraps Timebar.Charts.StackedActivity from @globalfishingwatch/timebar library and wires up data via useHeatmapActivityGraph hook. Formats hover labels by combining activity values (with conditional decimal precision for Environment visualizations), units, and i18n strings. Returns null if no activity data available.

## Related

- uses [[timebar-activity-hook]] — Consumes useHeatmapActivityGraph to fetch heatmapActivity, colorScale, loading state, and dataviews
- uses [[timebar-library-integration]] — Renders Timebar.Charts.StackedActivity component with activity data, color scaling, and tooltip callbacks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
