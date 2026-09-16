---
name: Timebar Library Public API
slug: timebar-library-public-api
type: file
sources:
  - path: libs/timebar/src/index.ts
    hash: 33b1d5a33ba526894594ee9bd5e42064257f15b8cfb7fc206437ab195bd38e2d
sources_digest: 5b2be7be1b36f58155333ae851f78e5b8d5478769ea18ae9bab94d13cea18929
links:
  - to: timebar-context-configuration
    relation: implements
    description: >-
      TimbarContext provider is re-exported for external use accessing timebar
      state
  - to: timebar-main-component
    relation: implements
    description: Main Timebar export is re-exported from index.ts as the primary public API
  - to: timeline-context-system
    relation: implements
    description: >-
      TimelineContext provider is re-exported for external use in custom chart
      integrations
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Primary entry point re-exporting all public APIs: utility functions (from ./utils), constants (EVENT_SOURCE, date formats), playback utilities, context providers (TimelineContext, TimbarContext), chart components, the main Timebar component, and the LastXOption type for time range picker customization. Enables clean top-level imports without exposing internal directory structure.

## Related

- implements [[timebar-context-configuration]] — TimbarContext provider is re-exported for external use accessing timebar state
- implements [[timebar-main-component]] — Main Timebar export is re-exported from index.ts as the primary public API
- implements [[timeline-context-system]] — TimelineContext provider is re-exported for external use in custom chart integrations

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
