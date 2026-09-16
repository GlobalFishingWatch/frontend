---
name: Vessel Insights Visualization
slug: vessel-insights-visualization
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/insights/LonglineSetsGraph.tsx
    hash: 4d3f448f398f5ad31154424a535bb4705ec9ef82a47f52e327b4c50dc30b3b02
sources_digest: 520f633633ad5a5b5d7d081388056cb02043e0b94e2c7b059aaddabeb5bf8efc
links:
  - to: vessel-event-activity-components
    relation: uses
    description: >-
      Uses Event component from activity module to render individual fishing
      events in expanded categories
  - to: vessel-profile-core
    relation: part_of
    description: Renders the Insights tab showing temporal fishing patterns
  - to: vessel-resource-selectors
    relation: uses
    description: Consumes event datasets filtered by type and timerange to populate chart
generator:
  version: 1
covers:
  - symbol: LonglineSetsGraph
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/insights/LonglineSetsGraph.tsx:L31-L155
---

<!-- context:generated:start -->

## Summary

Components rendering geospatial and temporal fishing pattern insights for vessels. LonglineSetsGraph visualizes longline sets grouped by time-of-day (day/night categories) as a horizontal stacked bar chart with expandable category legends and individual event details. Depends on deck-loaders getLonglineCategory for categorization and uses custom CSS properties for category colors. Supports custom render functions and event hover/click callbacks.

## Related

- uses [[vessel-event-activity-components]] — Uses Event component from activity module to render individual fishing events in expanded categories
- part of [[vessel-profile-core]] — Renders the Insights tab showing temporal fishing patterns
- uses [[vessel-resource-selectors]] — Consumes event datasets filtered by type and timerange to populate chart

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
