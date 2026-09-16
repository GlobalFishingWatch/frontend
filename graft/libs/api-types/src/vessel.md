# libs/api-types/src/vessel.ts · [[api-type-contracts]] [[multi-source-vessel-data-integration]]

Defines TypeScript type definitions for vessel data including authorization, vessel types, vessel properties, and search result structures.

- Authorization · type · L1-L7 — Represents a time-bound authorization record with source, start date, and end date information.
- VesselTypeV2 · type · L9-L18 — Enumeration of vessel classification types including seismic, cargo, passenger, fishing, and support vessels.
- Vessel · type · L20-L56 — Core vessel entity type containing identification, technical specifications, transmission metadata, and operational details.
- VesselSearch · type · L58-L62 — Extends Vessel with mandatory dataset, source, and vesselMatchId fields to represent searchable vessel records.
- RelatedVesselSearchMerged · type · L64-L66 — Extends VesselSearch to include a collection of related vessel search results grouped under a single vessel match.
