---
name: Timebar Context & Configuration
slug: timebar-context-configuration
type: file
sources:
  - path: libs/timebar/src/timebar-context.ts
    hash: 22a6d96e652dbb1f7bd3af6e52d28ec0d29c8f61a3e32631dc1beec5b563ef5e
sources_digest: 9b438ca2131a978dfc8946b24355671b700dc550f23595e4eedcda8fd7d7cbe2
links:
  - to: time-range-state-management
    relation: implements
    description: >-
      TimebarContextProps.notifyChange is bound to useTimebarRange's
      notifyChange method, funneling all child updates through the echo-buffer
      state machine
  - to: timebar-main-component
    relation: implements
    description: >-
      Timebar component supplies TimebarContextProps via
      TimebarContext.Provider; all children consume via useTimebar hook
generator:
  version: 1
covers:
  - symbol: TimebarContextProps
    kind: type
    at: 'libs/timebar/src/timebar-context.ts:L10-L30'
---

<!-- context:generated:start -->

## Summary

TimebarContextProps interface and useTimebar hook definition encapsulating all state, bounds, callbacks, and configuration needed by timebar child components. Provides read-only access to absolute/relative time ranges (start, end, absoluteStart, absoluteEnd), synchronous rangeRef for playback, notifyChange callback for emitting changes, optional onBookmarkChange and getCurrentInterval callbacks, and latestAvailableDataDate for UI state.

## Related

- implements [[time-range-state-management]] — TimebarContextProps.notifyChange is bound to useTimebarRange's notifyChange method, funneling all child updates through the echo-buffer state machine
- implements [[timebar-main-component]] — Timebar component supplies TimebarContextProps via TimebarContext.Provider; all children consume via useTimebar hook

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
