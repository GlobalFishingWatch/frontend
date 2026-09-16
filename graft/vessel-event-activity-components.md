---
name: Vessel Event Activity Components
slug: vessel-event-activity-components
type: system
sources:
  - path: apps/platform/features/_vessels/vessel/insights/LonglineSetsGraph.tsx
    hash: 4d3f448f398f5ad31154424a535bb4705ec9ef82a47f52e327b4c50dc30b3b02
sources_digest: 520f633633ad5a5b5d7d081388056cb02043e0b94e2c7b059aaddabeb5bf8efc
links:
  - to: vessel-insights-visualization
    relation: implements
    description: >-
      Event component used by LonglineSetsGraph to display individual fishing
      events
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

Components for displaying individual vessel fishing events and activity summaries. Event component renders structured event details with timestamps, types, and geospatial context. Activity tabs show event logs and filtering options. Integrates with event state management to track hovered and selected events for map highlighting.

## Related

- implements [[vessel-insights-visualization]] — Event component used by LonglineSetsGraph to display individual fishing events

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
