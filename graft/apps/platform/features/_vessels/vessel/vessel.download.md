# apps/platform/features/_vessels/vessel/vessel.download.ts · [[vessel-data-export]]

Exports CSV serialization utilities for vessel identity, activity events, and longline fishing sets.

- parseRegistryOwners · function · L15-L21 — Formats a list of vessel registry owners into a comma-separated string with name, flag, and date range.
- parseRegistryExtraField · function · L23-L25 — Extracts the value from a registry extra field or returns a placeholder for missing data.
- parseRegistryOperator · function · L27-L29 — Formats a vessel registry operator into a name-flag string or returns a placeholder if absent.
- parseRegistryAuthorizations · function · L31-L37 — Formats a list of registry authorizations into a comma-separated string with source code and date range.
- IdentityVesselCSVDownload · type · L65-L68 — Defines the vessel identity shape for CSV export with gear and ship types as strings.
- parseVesselToCSV · function · L70-L72 — Converts a vessel identity record to CSV format using the vessel configuration mapping.
- parseEventsToCSV · function · L108-L110 — Converts a list of activity events to CSV format using the events configuration mapping.
- parseLonglineSetsToCSV · function · L127-L131 — Converts longline fishing set events to CSV format with enriched category information.
