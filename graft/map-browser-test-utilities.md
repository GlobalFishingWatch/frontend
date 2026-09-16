---
name: Map Browser Test Utilities
slug: map-browser-test-utilities
type: file
sources:
  - path: apps/platform/test/utils/map.ts
    hash: 1c60a925c07d0fcdadbeab241b917497172c2e6632350f89d15cb0c210c78ef6
sources_digest: edea544aaf9847b4505a141d109a71bcefb426c35d71d644c5aae2eec3ca27cc
links:
  - to: test-navigation-utilities
    relation: uses
    description: >-
      Map utilities like openVesselOnMap depend on navigation functions to set
      up vessel tracks and event data on the map
generator:
  version: 1
covers:
  - symbol: MapTestId
    kind: type
    at: 'apps/platform/test/utils/map.ts:L15-L15'
  - symbol: waitForMapLoaded
    kind: function
    at: 'apps/platform/test/utils/map.ts:L17-L22'
  - symbol: waitForMapInstance
    kind: function
    at: 'apps/platform/test/utils/map.ts:L24-L31'
  - symbol: waitForMapViewport
    kind: function
    at: 'apps/platform/test/utils/map.ts:L33-L48'
  - symbol: waitForMapSpinnerHidden
    kind: function
    at: 'apps/platform/test/utils/map.ts:L50-L52'
  - symbol: waitForVesselTrackReady
    kind: function
    at: 'apps/platform/test/utils/map.ts:L55-L59'
  - symbol: clickMapAtCoordinates
    kind: function
    at: 'apps/platform/test/utils/map.ts:L61-L94'
  - symbol: openVesselOnMap
    kind: function
    at: 'apps/platform/test/utils/map.ts:L96-L117'
---

<!-- context:generated:start -->

## Summary

Test helpers for interacting with map components in browser tests. Provides polling-based utilities to wait for map initialization (via Jotai atoms), coordinate transformation, and click simulation. Uses the map's viewport to project geographic coordinates to screen pixels before simulating mouse events.

## Related

- uses [[test-navigation-utilities]] — Map utilities like openVesselOnMap depend on navigation functions to set up vessel tracks and event data on the map

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
