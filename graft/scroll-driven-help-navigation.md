---
name: Scroll-driven Help Navigation
slug: scroll-driven-help-navigation
type: concept
sources:
  - path: apps/platform/features/help/helpHub.hooks.ts
    hash: 45ae5f62bc96fdfe3d9eff15afd9759a960e224092dd6fa3f971d73b677aad44
sources_digest: 23a19d635d4e15378e25ce058e18ca7b30258af258eba4b391a6996cd01e6815
links:
  - to: help-hub-system
    relation: part_of
    description: >-
      Provides scroll tracking for HelpHubLandingPage and HelpHubSectionPage
      table of contents navigation
generator:
  version: 1
covers:
  - symbol: UseActiveItemOnScrollParams
    kind: type
    at: 'apps/platform/features/help/helpHub.hooks.ts:L5-L9'
  - symbol: useActiveItemOnScroll
    kind: function
    at: 'apps/platform/features/help/helpHub.hooks.ts:L11-L52'
---

<!-- context:generated:start -->

## Summary

IntersectionObserver-based mechanism in helpHub.hooks that auto-synchronizes active section indicator as user scrolls through help content, using negative bottom margin to trigger active state earlier for top-navigation UX patterns.

## Related

- part of [[help-hub-system]] — Provides scroll tracking for HelpHubLandingPage and HelpHubSectionPage table of contents navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
