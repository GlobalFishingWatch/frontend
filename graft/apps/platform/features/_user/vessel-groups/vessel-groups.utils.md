# apps/platform/features/_user/vessel-groups/vessel-groups.utils.ts · [[dataset-dataview-integration]] [[vessel-group-vessel-identity-reconciliation]] [[vessel-groups-management-system]]

Utility functions for vessel group operations including filtering, grouping, normalizing, and calculating vessel statistics.

- getVesselGroupLabel · function · L33-L36 — Formats a vessel group label with a private icon prefix if the group is not publicly suffixed.
- VesselPropertyApiSearch · type · L43-L45 — Type that represents a vessel property column compatible with API search, excluding renamed ID fields.
- vesselPropertyToApiSearch · function · L47-L54 — Converts vessel property column names to their API search equivalents, renaming vesselId to 'id' and mmsi to 'ssvid'.
- isIdFieldSupportedByDataset · function · L56-L63 — Checks if a given ID field is supported by a dataset's filter configuration, accounting for renamed and prefixed property names.
- getDatasetsIdFieldOptions · function · L66-L80 — Determines which ID field options are supported by all selected datasets for filtering vessel groups.
- normaliseCsvColumns · function · L82-L88 — Converts raw CSV column names into standardized API search property names.
- isOutdatedVesselGroup · function · L90-L95 — Determines if a vessel group was updated before the official report release date.
- getVesselGroupVesselsCount · function · L97-L103 — Retrieves the count of unique vessels in a group, preferring summary data or computing from individual vessel relationIds.
- removeDuplicatedVesselGroupvessels · function · L105-L107 — Removes duplicate vessels from a list by deduplicating on vesselId and dataset combination.
- removeVesselGroupvesselIdentity · function · L108-L111 — Strips identity information from vessel group vessels, retaining only vessel metadata.
- prepareVesselGroupVesselsUpdate · function · L112-L114 — Prepares a vessel list for update by removing identity objects and deduplicating on vesselId and dataset.
- getVesselGroupUniqVessels · function · L116-L141 — Extracts unique self-reported vessel identities from a group, filtering by relation ID match and deduplicating.
- groupVesselGroupVessels · function · L143-L161 — Groups vessels by a specified property (defaulting to ssvid), preferring self-reported values over registry values.
- mergeVesselGroupVesselIdentities · function · L163-L204 — Merges vessel group vessel records with identity data, establishing relation IDs and sorting alphabetically by ship name.
- flatVesselGroupSearchVessels · function · L206-L225 — Flattens vessel identities into searchable vessel group records with primary identity selection.
- parseVesselGroupVessels · function · L227-L255 — Converts incoming vessel data into standardized vessel group vessel identity records, filtering for self-reported sources.
- getVesselsWithoutDuplicates · function · L257-L262 — Deduplicates vessels with identity data by relation ID or vessel ID.
- calculateVMSVesselsPercentage · function · L264-L291 — Calculates the percentage of vessels with VMS tracking and returns a formatted summary including source codes.
