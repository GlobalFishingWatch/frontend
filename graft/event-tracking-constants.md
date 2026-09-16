---
name: Event Tracking & Constants
slug: event-tracking-constants
type: system
sources:
  - path: libs/timebar/src/constants.ts
    hash: 36137dee405e81af2a1ed0765ae1357b488bbc093d1407e65074b7ba996117b4
sources_digest: 203162fa4e5dd419c4c9abb6b83252bc4b936e97ab4f16c5bbb63c1c91b23a66
links:
  - to: interval-zoom-ui
    relation: configures
    description: >-
      Interval selection and unit zoom clicks emit EVENT_INTERVAL_SOURCE
      mappings and time range changes
  - to: playback-control-system
    relation: configures
    description: >-
      Playback stepping emits EVENT_SOURCE.PLAYBACK_FRAME and respects speed
      configurations; loop reset emits PLAYBACK_RESET
  - to: timebar-main-component
    relation: configures
    description: >-
      All onChange events are tagged with EVENT_SOURCE constants identifying the
      interaction source
  - to: timeline-drag-handler
    relation: configures
    description: >-
      Drag events emit resolveDragSource results (DRAG_START, DRAG_END,
      ZOOM_IN_RELEASE, etc.) for telemetry
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Centralized configuration module exporting EVENT_SOURCE (enum-like object mapping user actions to telemetry string IDs), EVENT_INTERVAL_SOURCE (bidirectional mapping between FourwingsInterval types and their event names), date format constants, and UI dimension constraints (MINIMUM_TIMEBAR_HEIGHT, MAXIMUM_TIMEBAR_HEIGHT). All components tag state changes and user interactions with EVENT_SOURCE constants, enabling analytics and debugging.

## Related

- configures [[interval-zoom-ui]] — Interval selection and unit zoom clicks emit EVENT_INTERVAL_SOURCE mappings and time range changes
- configures [[playback-control-system]] — Playback stepping emits EVENT_SOURCE.PLAYBACK_FRAME and respects speed configurations; loop reset emits PLAYBACK_RESET
- configures [[timebar-main-component]] — All onChange events are tagged with EVENT_SOURCE constants identifying the interaction source
- configures [[timeline-drag-handler]] — Drag events emit resolveDragSource results (DRAG_START, DRAG_END, ZOOM_IN_RELEASE, etc.) for telemetry

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
