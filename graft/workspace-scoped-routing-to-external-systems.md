---
name: Workspace-scoped Routing to External Systems
slug: workspace-scoped-routing-to-external-systems
type: concept
sources:
  - path: >-
      apps/platform/features/_vessels/track-correction/track-correction.constants.ts
    hash: c55105e748e2039d2af2a6d7f8eec88c00337a6cc85ce647f63988cecdce0710
  - path: apps/platform/features/_vessels/track-correction/track-correction.utils.ts
    hash: e044086a96b4116b613a837377316f661c924d6d2e93dcb541a6073923108e50
  - path: apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx
    hash: 5e3036a25c79dd5641d4ecf6ba6553b6002cfbe83188a017cf3813f6b69427af
sources_digest: 1d3a48800c3cf73ac1fe08106d6c4d8b9c222a2c0858a27c5ae8692a7c73427a
links:
  - to: track-correction-feature
    relation: implements
    description: >-
      TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE routes track corrections to
      workspace-specific sheets via environment config
generator:
  version: 1
covers:
  - symbol: TrackCorrectionNew
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/TrackCorrectionNew.tsx:L42-L303
  - symbol: TurningTidesWorkspaceId
    kind: type
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.constants.ts:L15-L15
  - symbol: getCustomVesselPropertiesByWorkspaceId
    kind: function
    at: >-
      apps/platform/features/_vessels/track-correction/track-correction.utils.ts:L27-L59
---

<!-- context:generated:start -->

## Summary

Maps workspace IDs to region-specific external integrations (Google Sheets spreadsheets for track corrections, region lookups). Environment variables seed regional spreadsheet IDs; code loads custom vessel properties by workspace context. Enables multi-tenant data isolation without hardcoding.

## Related

- implements [[track-correction-feature]] — TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE routes track corrections to workspace-specific sheets via environment config

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
