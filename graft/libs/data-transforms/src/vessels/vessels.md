# libs/data-transforms/src/vessels/vessels.ts · [[vessel-identification]]

Module exporting vessel identifier type definitions and classification logic.

- VesselIdentifierType · type · L5-L5 — Union type representing the three supported vessel identifier formats: SSVID, IMO number, or radio call sign.
- getVesselIdentifierType · function · L7-L21 — Classifies a query string into one of three vessel identifier types based on length and character constraints.
