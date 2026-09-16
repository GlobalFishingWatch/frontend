---
name: Sidebar State Management
slug: sidebar-state-management
type: concept
sources:
  - path: apps/platform/features/_map/sidebar/sidebar-header.hooks.ts
    hash: 50acfbbd729196da6dd4e4098d2deac83aa0b7a3ca4bb8f71caa6ac55c1bd90b
  - path: apps/platform/features/_map/sidebar/sidebar.selectors.ts
    hash: 3e7a9d9fb2d02b188d6a74ee8736dbec0b70e1f40aab3bb0c9b380b43f1e62da
sources_digest: 0c513a52f3c97374e2503b1dd660c8dd99367e6180b6cb43d88c9f038599c68e
links:
  - to: router-integration-navigation
    relation: uses
    description: >-
      cleanVesselProfileDataviewInstances utility strips origin=vesselProfile
      metadata from dataview instances to prevent leakage into shared contexts
  - to: sidebar-container-layout
    relation: uses
    description: >-
      Sidebar components read selectHasTimeModeEnabled and
      selectDataviewsResources from sidebar.selectors to control visibility and
      layout
  - to: time-mode-real-time-state
    relation: uses
    description: >-
      selectHasTimeModeEnabled gates TimeModeSelector rendering behind
      IS_REALTIME_ENABLED and route location checks
generator:
  version: 1
covers:
  - symbol: cleanVesselProfileDataviewInstances
    kind: function
    at: 'apps/platform/features/_map/sidebar/sidebar-header.hooks.ts:L4-L19'
---

<!-- context:generated:start -->

## Summary

Centralized Redux state and selectors for controlling sidebar visibility, time-mode enablement, and scroll behavior. These selectors coordinate route context with feature flags to determine which sidebar components render.

## Related

- uses [[router-integration-navigation]] — cleanVesselProfileDataviewInstances utility strips origin=vesselProfile metadata from dataview instances to prevent leakage into shared contexts
- uses [[sidebar-container-layout]] — Sidebar components read selectHasTimeModeEnabled and selectDataviewsResources from sidebar.selectors to control visibility and layout
- uses [[time-mode-real-time-state]] — selectHasTimeModeEnabled gates TimeModeSelector rendering behind IS_REALTIME_ENABLED and route location checks

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
