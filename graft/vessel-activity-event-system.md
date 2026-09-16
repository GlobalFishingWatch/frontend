---
name: Vessel Activity Event System
slug: vessel-activity-event-system
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityByType.tsx
    hash: 7bef2fb0366551d86dbe29a2ffa64c57cd6948b9f3b470dda12ddc339bd71b55
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityGroup.tsx
    hash: 9c9381ecdc92398301bd8465345ea3541d32a6d39a1bb8157e3602eca8dadbef
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/ActivityByVoyage.tsx
    hash: b5b284adaf7be447f9873a5b9aa89a5418a446c89b6937fadf3ba8e5918e5a40
  - path: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/VoyageGroup.tsx
    hash: 262481452d117812c3a04f2042814af92ff2c89636c2093c5cc0bb01af714042
  - path: apps/platform/features/_vessels/vessel/activity/event/ActivityDate.tsx
    hash: c71f24d5f7ab9d2847401368b68006a470f56e1b4a3c66227bc450c2128db05d
  - path: >-
      apps/platform/features/_vessels/vessel/activity/event/event-activity.hooks.ts
    hash: 4304648e0603fa058e2ade5c500e5137e4dea9d3be94d350bfed84efb2a1a2bd
  - path: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts
    hash: 64227dacee4da1f87e848124928a989ae611576778103ca7d5326469d24ec0b6
  - path: apps/platform/features/_vessels/vessel/activity/event/event.bounds.ts
    hash: 4aba157b94e837f9f5238c3e558698a7bb7be7a6c91b25eef311c3da9054d551
  - path: apps/platform/features/_vessels/vessel/activity/event/event.hook.tsx
    hash: 740d8440ef34e95fa8781b6173315b34574246285be2944b39a2972dcff8fb58
  - path: apps/platform/features/_vessels/vessel/activity/event/Event.tsx
    hash: aa97ef8ab070e10a25496ba41afd4c41174fea44b6414e6632c66354d5da6f7d
  - path: apps/platform/features/_vessels/vessel/activity/event/EventDetail.tsx
    hash: b0322d426a6e280aeb3c8e5c95b48b48a1966426d7f5c43609be54614da750b8
  - path: apps/platform/features/_vessels/vessel/activity/event/EventIcon.tsx
    hash: 68adcd8af46128ec62e954a0497df854c11266c23aa895649e8c7ee3a226ae3c
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx
    hash: db455dffde8b18e272ac5c5d3de52ecda9ee7e424de2ed7657a2d08847a7ae6e
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivityDownload.tsx
    hash: a577bb16229d5693f2e9f8db9a415473db0be974ffbf370524e5638c57832b01
  - path: apps/platform/features/_vessels/vessel/activity/VesselActivitySummary.tsx
    hash: c325b832fc64b895930c2f70d748694251aee63d16413393338f1e2c024ba006
  - path: >-
      apps/platform/features/_vessels/vessel/activity/vessels-activity.selectors.ts
    hash: a0ed8cd43c8ab06ebe87377f89855283e30bb0d991a52290e67ae54aaeebc63d
sources_digest: 22498ac457cfe21a0ca823f9f7670a55faf9badd1478e9a37ed5b3721d2a496c
links:
  - to: cross-feature-scroll-synchronization
    relation: implements
    description: >-
      Uses Jotai atoms + Redux hybrid state to coordinate scroll position, event
      selection, and center-of-viewport detection
  - to: event-grouping-summarization
    relation: implements
    description: >-
      Partitions events by type or voyage, aggregates fishing hours/ports,
      computes region priority ordering, and maintains expansion state
  - to: guest-permission-guards
    relation: uses
    description: >-
      Download functionality wrapped in UserLoggedIconButton for authentication
      checks
  - to: map-integration-layer
    relation: uses
    description: >-
      Dispatches highlighted events to map layer, fits bounds to event
      locations, and synchronizes sidebar state with map view
  - to: redux-state-selectors-pattern
    relation: implements
    description: >-
      Extensive use of memoized selectors (selectEventsGroupedByType,
      selectEventsGroupedByVoyages, selectActivitySummary) for efficient event
      grouping and filtering
  - to: virtualized-list-rendering
    relation: implements
    description: >-
      Uses react-virtuoso GroupedVirtuoso for performant rendering of large
      event lists with grouped headers and print-mode fallback
generator:
  version: 1
covers:
  - symbol: VesselActivity
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L22-L96'
  - symbol: setActivityMode
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/VesselActivity.tsx:L30-L36'
  - symbol: VesselActivityDownload
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/VesselActivityDownload.tsx:L19-L64
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/VesselActivityDownload.tsx:L29-L48
  - symbol: VesselActivitySummary
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/VesselActivitySummary.tsx:L39-L257
  - symbol: ActivityByType
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityByType.tsx:L36-L220
  - symbol: ActivityGroupProps
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityGroup.tsx:L14-L21
  - symbol: ActivityGroup
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-type/ActivityGroup.tsx:L23-L58
  - symbol: ActivityByVoyage
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/ActivityByVoyage.tsx:L35-L222
  - symbol: EventProps
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/VoyageGroup.tsx:L19-L26
  - symbol: VoyageGroup
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/VoyageGroup.tsx:L28-L137
  - symbol: onDownloadClick
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/activity-by-voyage/VoyageGroup.tsx:L74-L82
  - symbol: ActivityDateProps
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/ActivityDate.tsx:L11-L13
  - symbol: ActivityDate
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/ActivityDate.tsx:L15-L38
  - symbol: EventProps
    kind: interface
    at: 'apps/platform/features/_vessels/vessel/activity/event/Event.tsx:L18-L30'
  - symbol: Event
    kind: function
    at: 'apps/platform/features/_vessels/vessel/activity/event/Event.tsx:L34-L110'
  - symbol: ActivityContentProps
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/EventDetail.tsx:L27-L29
  - symbol: TimeFields
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/EventDetail.tsx:L33-L76
  - symbol: PortVisitedAfterField
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/EventDetail.tsx:L78-L95
  - symbol: EventDetail
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/EventDetail.tsx:L97-L286
  - symbol: EventProps
    kind: interface
    at: 'apps/platform/features/_vessels/vessel/activity/event/EventIcon.tsx:L9-L11'
  - symbol: ActivityEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/EventIcon.tsx:L13-L19
  - symbol: useEventActivityToggle
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-activity.hooks.ts:L18-L53
  - symbol: useVirtuosoScroll
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L33-L63
  - symbol: useVirtuosoScrollToEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L65-L109
  - symbol: useVesselProfileScrollToEvent
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L111-L135
  - symbol: useEventsScroll
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event-scroll.hooks.ts:L137-L216
  - symbol: useVesselEventBounds
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event.bounds.ts:L14-L63
  - symbol: useFetchRegionsData
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event.hook.tsx:L25-L33
  - symbol: useActivityEventTranslations
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/activity/event/event.hook.tsx:L35-L255
  - symbol: ActivityEvent
    kind: interface
    at: >-
      apps/platform/features/_vessels/vessel/activity/vessels-activity.selectors.ts:L22-L25
---

<!-- context:generated:start -->

## Summary

Displays grouped and virtualized vessel event timelines (by event-type or voyage) with cross-cutting features: map synchronization, region summarization, event filtering, scroll coordination, and downloadable activity exports. Serves as the primary activity dashboard in vessel profiles.

## Related

- implements [[cross-feature-scroll-synchronization]] — Uses Jotai atoms + Redux hybrid state to coordinate scroll position, event selection, and center-of-viewport detection
- implements [[event-grouping-summarization]] — Partitions events by type or voyage, aggregates fishing hours/ports, computes region priority ordering, and maintains expansion state
- uses [[guest-permission-guards]] — Download functionality wrapped in UserLoggedIconButton for authentication checks
- uses [[map-integration-layer]] — Dispatches highlighted events to map layer, fits bounds to event locations, and synchronizes sidebar state with map view
- implements [[redux-state-selectors-pattern]] — Extensive use of memoized selectors (selectEventsGroupedByType, selectEventsGroupedByVoyages, selectActivitySummary) for efficient event grouping and filtering
- implements [[virtualized-list-rendering]] — Uses react-virtuoso GroupedVirtuoso for performant rendering of large event lists with grouped headers and print-mode fallback

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
