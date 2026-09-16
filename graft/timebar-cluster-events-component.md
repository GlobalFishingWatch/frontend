---
name: Timebar Cluster Events Component
slug: timebar-cluster-events-component
type: file
sources:
  - path: apps/platform/features/_map/timebar/TimebarClusterEventsGraph.tsx
    hash: fbc4eead49c307101859945e57b927e93134bd56e66730a5073fdce57c6cfa7e
sources_digest: 4c1c00904836f1111e1e91b1876e7c40b8dbf336e99f36e81be950e25c7ed201
links:
  - to: timebar-cluster-events-hook
    relation: uses
    description: >-
      Consumes useClusterEventsGraph to fetch eventsActivity timeseries and
      loading state
  - to: timebar-library-integration
    relation: uses
    description: Renders Timebar.Charts.StackedActivity with event data and callbacks
  - to: workspace-redux-state
    relation: depends_on
    description: >-
      Selects selectActiveActivityDataviewsByVisualisation for determining
      active dataviews and icon mapping
generator:
  version: 1
covers:
  - symbol: TimebarClusterEventsGraph
    kind: function
    at: 'apps/platform/features/_map/timebar/TimebarClusterEventsGraph.tsx:L19-L60'
---

<!-- context:generated:start -->

## Summary

React component that renders a stacked activity chart in the timebar for clustered event data across time periods. Selects active activity dataviews via selectActiveActivityDataviewsByVisualisation and retrieves event timeseries via useClusterEventsGraph. Provides two callbacks: getActivityHighlighterLabel formats event counts and localized text, getActivityHighlighterIconCallback maps event types to icon IDs by matching dataview datasets with their EventType subcategory. Returns null if event data, active dataviews, or timeseries unavailable.

## Related

- uses [[timebar-cluster-events-hook]] — Consumes useClusterEventsGraph to fetch eventsActivity timeseries and loading state
- uses [[timebar-library-integration]] — Renders Timebar.Charts.StackedActivity with event data and callbacks
- depends on [[workspace-redux-state]] — Selects selectActiveActivityDataviewsByVisualisation for determining active dataviews and icon mapping

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
