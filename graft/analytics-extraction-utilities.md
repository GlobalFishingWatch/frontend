---
name: Analytics Extraction Utilities
slug: analytics-extraction-utilities
type: file
sources:
  - path: apps/platform/utils/analytics.ts
    hash: fc1016d53223c010e04a1bd15074135f4c399e19f0ab70a88fe5f8bfeffbcb2f
sources_digest: e4529c21527d2d5419cdcbf5da94cd8970532ae2b7fb4f439429a33d3c3595db
links: []
generator:
  version: 1
covers:
  - symbol: getActivitySources
    kind: function
    at: 'apps/platform/utils/analytics.ts:L5-L6'
  - symbol: getActivityFilters
    kind: function
    at: 'apps/platform/utils/analytics.ts:L8-L16'
  - symbol: getEventLabel
    kind: function
    at: 'apps/platform/utils/analytics.ts:L18-L18'
---

<!-- context:generated:start -->

## Summary

Helper functions for normalizing complex internal data structures into simplified formats for analytics event tracking. Extracts active dataset IDs from dataviews, transforms filter objects into field-value pairs, and joins event labels with pipe delimiters for analytics instrumentation.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
