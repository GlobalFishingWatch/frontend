---
name: Localization & Labels
slug: localization-labels
type: file
sources:
  - path: libs/timebar/src/timebar-labels.ts
    hash: 8ed9468cd1a8a15ecad019b2b0498507dbb7ac556d1a9859fbd7159822e0615f
sources_digest: 37179f0c288a15e36dd0bcdee790e169667f1da3f74744bac1bec7f1f2c249b4
links:
  - to: timebar-main-component
    relation: configures
    description: >-
      Timebar accepts optional TimebarLabels prop (merged with DEFAULT_LABELS)
      and passes through TimebarContext to all child components
  - to: timeline-layout-labels
    relation: configures
    description: >-
      Timeline label rendering uses TimebarLabels and DEFAULT_LABELS to format
      unit text and apply locale-aware hour/minute display
generator:
  version: 1
covers:
  - symbol: TimebarLabels
    kind: type
    at: 'libs/timebar/src/timebar-labels.ts:L42-L42'
---

<!-- context:generated:start -->

## Summary

TimebarLabels type and DEFAULT_LABELS object provide all user-facing text strings for the timebar UI (bookmark buttons, playback controls, time range picker, interval names, etc.). Designed for i18n integration where callers substitute custom label objects while maintaining type safety across all components.

## Related

- configures [[timebar-main-component]] — Timebar accepts optional TimebarLabels prop (merged with DEFAULT_LABELS) and passes through TimebarContext to all child components
- configures [[timeline-layout-labels]] — Timeline label rendering uses TimebarLabels and DEFAULT_LABELS to format unit text and apply locale-aware hour/minute display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
