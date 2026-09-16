---
name: vessels public API
slug: vessels-public-api
type: system
sources:
  - path: libs/deck-loaders/src/vessels/index.ts
    hash: ef0b5d37545e0bde691b893c0569ee0b987687920709a764ffcdb01a80415f0a
sources_digest: 440215f2ebf6d6c6acab536507c85c2c172a167050711a8e2a041f15fd7dd2c0
links:
  - to: vessel-events-loaders-loaders-gl
    relation: produces
    description: Exports VesselEventsLoader and VesselEventsWorkerLoader to consumers
  - to: vessel-tracks-loaders-loaders-gl
    relation: produces
    description: Exports VesselTrackLoader and VesselTrackWorkerLoader to consumers
  - to: vessel-tracks-parsing-pipeline
    relation: uses
    description: >-
      Re-exports utility functions from parse-tracks (toAbsoluteTimestamp,
      toRelativeTimestamp, getVesselGraphExtentClamped)
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Public entry point for vessel data loading functionality, re-exporting track loaders (VesselTrackLoader, VesselTrackWorkerLoader), event loaders (VesselEventsLoader, VesselEventsWorkerLoader), and utility functions for timestamp conversion (toAbsoluteTimestamp, toRelativeTimestamp) and spatial bounds computation (getVesselGraphExtentClamped).

## Related

- produces [[vessel-events-loaders-loaders-gl]] — Exports VesselEventsLoader and VesselEventsWorkerLoader to consumers
- produces [[vessel-tracks-loaders-loaders-gl]] — Exports VesselTrackLoader and VesselTrackWorkerLoader to consumers
- uses [[vessel-tracks-parsing-pipeline]] — Re-exports utility functions from parse-tracks (toAbsoluteTimestamp, toRelativeTimestamp, getVesselGraphExtentClamped)

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
