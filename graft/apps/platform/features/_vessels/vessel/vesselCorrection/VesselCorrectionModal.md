# apps/platform/features/_vessels/vessel/vesselCorrection/VesselCorrectionModal.tsx · [[vessel-correction-workflow]]

A React modal component that allows GFW-only users to propose corrections to vessel identity information (flag, ship name, gear types, ship types, etc.) sourced from either registry or AIS data.

- InfoCorrectionModalProps · type · L37-L40 — Type definition for the modal component props controlling visibility and close behavior.
- VesselCorrectionModal · function · L42-L333 — React component that renders an editable form allowing GFW users to propose corrections to vessel metadata fields (name, flag, gear types, ship types) and submit them with analyst comments.
- sendCorrection · function · L64-L132 — Async handler that collects user-proposed vessel corrections with original values and metadata, sends them to the backend API, and logs the submission event.
