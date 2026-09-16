# libs/dataviews-client/src/dataviews.utils.ts · [[dataview-instance-composition]] [[vessel-dataview-factory-pattern]]

Utility module providing functions to parse vessel and encounter dataview instance identifiers and construct their formatted strings.

- getVesselIdFromInstanceId · function · L11-L28 — Extracts the vessel ID from a dataview instance ID by removing the appropriate prefix and version suffix.
- getIsVesselDataviewInstanceId · function · L30-L32 — Checks whether a dataview instance ID is a vessel dataview by verifying its string type and vessel prefix.
- getIsEncounteredVesselDataviewInstanceId · function · L34-L36 — Checks whether a dataview instance ID is an encountered vessel dataview by verifying its string type and encounter prefix.
- getVesselDataviewInstanceId · function · L38-L41 — Constructs a vessel dataview instance ID by combining the vessel prefix, ID, version separator, and dataset version.
- getEncounteredVesselDataviewInstanceId · function · L43-L44 — Constructs an encountered vessel dataview instance ID by combining the encounter prefix, vessel ID, version separator, and pipe dataset ID.
