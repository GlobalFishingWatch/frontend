---
name: Timebar Points Graph Component
slug: timebar-points-graph-component
type: file
sources:
  - path: apps/platform/features/_map/timebar/TimebarPointsGraph.tsx
    hash: 3d6f6583b732bd1d8e190482372cac779992c6ced1e28585356edbcc3a9a626f
sources_digest: 1d68268630b3e082c206d76b5e30d14fcd56c792d16dfd4f6d01473c133dc234
links:
  - to: timebar-library-integration
    relation: uses
    description: >-
      Renders Timebar.Charts.StackedActivity component with points data and
      color scaling
generator:
  version: 1
covers:
  - symbol: TimebarPointsGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarPointsGraph.tsx:L12-L52'
---

<!-- context:generated:start -->

## Summary

React component that renders a stacked activity chart in the timebar for point-based data (e.g., vessel positions, catch observations). Pulls timeseries points and dataviews from useTimebarPoints hook and renders via Timebar.Charts.StackedActivity. Constructs getActivityHighlighterLabel callback that formats tooltip labels combining point counts, aggregated property values (biomass, catch tonnage), and i18n text. Uses early return pattern when data unavailable and hardcodes 'dots' icon type for visual consistency.

## Related

- uses [[timebar-library-integration]] — Renders Timebar.Charts.StackedActivity component with points data and color scaling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
