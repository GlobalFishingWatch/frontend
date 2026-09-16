---
name: Maritime Event Utilities
slug: maritime-event-utilities
type: file
sources:
  - path: apps/platform/utils/events.tsx
    hash: 493ff87d412f407ab053525b886c407af4c89152dd39a04ae8d7fa5d2d2741e4
sources_digest: 9cc393c7ac78edaac1a50595829d9e3567a9d87570c0d3e2a5f37bf5f4cdf422
links: []
generator:
  version: 1
covers:
  - symbol: getEventColors
    kind: function
    at: 'apps/platform/utils/events.tsx:L18-L31'
  - symbol: getEventDurationLabel
    kind: function
    at: 'apps/platform/utils/events.tsx:L33-L48'
  - symbol: TimeLabels
    kind: type
    at: 'apps/platform/utils/events.tsx:L50-L53'
  - symbol: getTimeLabels
    kind: function
    at: 'apps/platform/utils/events.tsx:L54-L72'
  - symbol: getLonglineCategoryLabel
    kind: function
    at: 'apps/platform/utils/events.tsx:L74-L85'
  - symbol: getEventDescription
    kind: function
    at: 'apps/platform/utils/events.tsx:L87-L166'
---

<!-- context:generated:start -->

## Summary

Functions for formatting and describing maritime events (Encounter, Port, Loitering, Fishing, Gap, longline sets) in human-readable form. Transforms API event data into colored labels and localized descriptions with time/duration information using Luxon date arithmetic. Special handling for longline categories using external deck-loaders classification.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
