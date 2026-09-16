---
name: Vessel Correction Workflow
slug: vessel-correction-workflow
type: system
sources:
  - path: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrection.types.tsx
    hash: 357a8d19bb1bc7df4b17600e2acabb3ba3f9558f8a4420a7321648fabb5a28ae
  - path: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrectionModal.tsx
    hash: 00586f6fb949418f830cb8f16450bc5f7acbc7424e0ca79d86666dd8263a8cc1
sources_digest: d8bf7d49080f46e7f1d64b1bc60c44802364e8cccfcd00f72257c3e757e412fc
links:
  - to: vessel-identity-resolution
    relation: validates
    description: >-
      Correction workflow validates proposed vessel attribute changes before
      submission
  - to: vessel-profile-core
    relation: uses
    description: >-
      VesselCorrectionModal accessible from vessel profile for submitting
      identity corrections
generator:
  version: 1
covers:
  - symbol: RelevantDataFields
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrection.types.tsx:L1-L11
  - symbol: InfoCorrectionSendFormat
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrection.types.tsx:L13-L25
  - symbol: ProposedFields
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrection.types.tsx:L31-L39
  - symbol: InfoCorrectionSendFormdrgdfgat
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrection.types.tsx:L41-L68
  - symbol: InfoCorrectionModalProps
    kind: type
    at: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrectionModal.tsx:L37-L40
  - symbol: VesselCorrectionModal
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrectionModal.tsx:L42-L333
  - symbol: sendCorrection
    kind: function
    at: >-
      apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrectionModal.tsx:L64-L132
---

<!-- context:generated:start -->

## Summary

Modal-based interface allowing authenticated analysts to submit corrections to vessel identity data (ship name, flag, gear types). VesselCorrectionModal accepts proposed changes with inline comments, validates against VALID_REGISTRY_FIELDS or VALID_AIS_FIELDS based on identity source, and POSTs structured metadata to /api/corrections endpoint including reviewer email, timestamps, and original/proposed values. Restricted to Global Fishing Watch team members via GFWOnly permission wrapper.

## Related

- validates [[vessel-identity-resolution]] — Correction workflow validates proposed vessel attribute changes before submission
- uses [[vessel-profile-core]] — VesselCorrectionModal accessible from vessel profile for submitting identity corrections

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
