# libs/api-types/src/vesselGroups.ts · [[api-type-contracts]]

Defines type contracts for vessel group entities and their constituent vessels, enabling type-safe operations on grouped vessel collections.

- VesselGroupVessel · type · L1-L7 — Represents a single vessel within a group, tracking its dataset, ID, relation, and optional metadata.
- VesselGroupVesselsSummary · type · L9-L13 — Aggregates summary statistics about vessels in a group including counts and dataset distribution.
- VesselGroup · type · L15-L25 — Defines a vessel group with identity, ownership, temporal tracking, and optional vessel collections.
- VesselGroupUpsert · type · L27-L27 — Restricts updates to vessel groups to only the essential fields: identity, name, vessels, and visibility.
