---
name: Track-Labeler Redux State & Resources
slug: track-labeler-redux-state-resources
type: system
sources:
  - path: apps/track-labeler/src/features/dataviews/dataviews.slice.ts
    hash: 922385f3b0068f37d1b06a7d9dc6762a5d4e88f89f5ca6b197e1b343cff711dd
  - path: apps/track-labeler/src/features/dataviews/resources.slice.ts
    hash: 1843bb8a845c2aa232b6087a132551c52b187be5dcddcb38c2d0f8cb207bf0be
sources_digest: d542548bcd2901f28e5c4ac13255c99d64b6db6b79df28a2378b29d0bbf054f2
links:
  - to: track-labeler-interactive-vessel-track-labeling
    relation: uses
    description: Redux state feeds vessel and resource data to labeling interface
generator:
  version: 1
covers:
  - symbol: selectDataviews
    kind: function
    at: 'apps/track-labeler/src/features/dataviews/dataviews.slice.ts:L21-L21'
  - symbol: AppResource
    kind: interface
    at: 'apps/track-labeler/src/features/dataviews/resources.slice.ts:L9-L13'
  - symbol: selectResources
    kind: function
    at: 'apps/track-labeler/src/features/dataviews/resources.slice.ts:L69-L69'
---

<!-- context:generated:start -->

## Summary

Manages deprecated dataviews store and resource collection (vessel data, maps, etc.) with loading state tracking. AppResource extends base Resource type with loaded flag, type, and resolvedUrl; completeLoading reducer sorts MMSI/flag histories by recency and extracts lastMMSI/lastFlag. addResources deduplicates by resolvedUrl to avoid refetching; selectors provide access via Redux RootState.

## Related

- uses [[track-labeler-interactive-vessel-track-labeling]] — Redux state feeds vessel and resource data to labeling interface

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
