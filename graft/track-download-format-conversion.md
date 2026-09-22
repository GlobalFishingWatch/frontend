---
name: Track Download & Format Conversion
slug: track-download-format-conversion
type: system
sources:
  - path: apps/platform/features/_map/download/downloadTrack.config.ts
    hash: 6895035854d063d93b42c4f84795964fb9cbf21c62bf2caf9e9a540b02499283
  - path: apps/platform/features/_map/download/downloadTrack.slice.ts
    hash: c1b2d8daa0bfaec23a8918fc2c34ba2cdd3d548397e02e9a545521dc01ba42a1
  - path: apps/platform/features/_map/download/DownloadTrackModal.tsx
    hash: 673b424f336255ec8859fe0af606d145ab42fa54614360b042429f239e2676f9
  - path: apps/platform/features/_map/download/geojson-to-kml.ts
    hash: 6c570d44fd15b83c563c2652307c80857c30d531f5550a1769c628495e66378e
sources_digest: ec853b215c6978836e852ff9e0f5fb49c13e677b044cf03a41e2cf9f820a55ce
links:
  - to: download-state-workflow-orchestration
    relation: part_of
    description: >-
      Track download is a separate Redux slice and thunk parallel to activity
      download, both sharing modal lifecycle patterns.
  - to: download-ui-form-components
    relation: uses
    description: >-
      DownloadTrackModal component dispatches downloadTrackThunk and reads
      rate-limit selectors from downloadTrack.slice.
generator:
  version: 1
covers:
  - symbol: DownloadTrackModal
    kind: function
    at: 'apps/platform/features/_map/download/DownloadTrackModal.tsx:L35-L147'
  - symbol: onClose
    kind: function
    at: 'apps/platform/features/_map/download/DownloadTrackModal.tsx:L50-L53'
  - symbol: onDownloadClick
    kind: function
    at: 'apps/platform/features/_map/download/DownloadTrackModal.tsx:L55-L82'
  - symbol: Format
    kind: enum
    at: 'apps/platform/features/_map/download/downloadTrack.config.ts:L3-L7'
  - symbol: VesselParams
    kind: type
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L17-L21'
  - symbol: DownloadTrackState
    kind: interface
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L23-L30'
  - symbol: DownloadTrackParams
    kind: type
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L41-L48'
  - symbol: parseRateLimit
    kind: function
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L50-L57'
  - symbol: RejectValueType
    kind: type
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L59-L59'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/_map/download/downloadTrack.slice.ts:L182-L182'
  - symbol: escapeXml
    kind: function
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L11-L15'
  - symbol: toIsoString
    kind: function
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L18-L22'
  - symbol: TrackLine
    kind: type
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L24-L28'
  - symbol: getFeatureLines
    kind: function
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L30-L46'
  - symbol: lineString
    kind: function
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L48-L53'
  - symbol: track
    kind: function
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L57-L63'
  - symbol: lineToPlacemark
    kind: function
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L65-L72'
  - symbol: geoJsonToKml
    kind: function
    at: 'apps/platform/features/_map/download/geojson-to-kml.ts:L74-L83'
---

<!-- context:generated:start -->

## Summary

downloadTrackThunk fetches compressed vessel track data from GFWAPI for user-selected vessels, date ranges, and formats (CSV, GeoJSON, KML). The slice maintains downloadTrack state including vessel IDs, dataset, and rate-limit headers from API responses. The geojson-to-kml converter intelligently handles per-coordinate timestamps via Google's `<gx:Track>` extension when available, falling back to `<LineString>` for incomplete data, with strict XML escaping and feature-name resolution from GeoJSON properties. jszip bundles multi-format conversions.

## Related

- part of [[download-state-workflow-orchestration]] — Track download is a separate Redux slice and thunk parallel to activity download, both sharing modal lifecycle patterns.
- uses [[download-ui-form-components]] — DownloadTrackModal component dispatches downloadTrackThunk and reads rate-limit selectors from downloadTrack.slice.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
