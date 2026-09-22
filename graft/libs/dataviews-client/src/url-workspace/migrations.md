# libs/dataviews-client/src/url-workspace/migrations.ts · [[dataview-url-workspace]]

Module that provides dataset and endpoint ID migration functions to transform legacy v2 data identifiers to current formats.

- removeLegacyEndpointPrefix · function · L10-L15 — Converts legacy endpoint identifier prefixes, specifically mapping 'user-context-tiles' to its current EndpointId and stripping 'carriers-' prefix.
- migrateLegacyVMSPublicDataset · function · L17-L21 — Migrates legacy public VMS dataset identifiers by replacing 'public-' prefix with 'full-' when the dataset matches known public VMS track datasets.
- migrateLegacyVMSFullDataset · function · L23-L27 — Reverses legacy full VMS dataset migrations by replacing 'full-' prefix with 'public-' when the dataset matches known full VMS vessel datasets.
- migrateLegacyVMSDatasets · function · L29-L31 — Chains both public and full VMS dataset migrations to handle bidirectional dataset identifier conversions.
- migrateDetectionsLegacyDatasets · function · L33-L39 — Maps legacy detection dataset identifiers to their current equivalents using a lookup dictionary.
- migrateVesselLegacyDatasets · function · L41-L43 — Maps legacy vessel dataset identifiers to their current equivalents using a lookup dictionary.
- runDatasetMigrations · function · L45-L49 — Orchestrates all dataset migrations in sequence—VMS, vessel, and detection—to fully update a legacy dataset identifier.
- migrateEventsLegacyDatasets · function · L51-L53 — Maps legacy events dataset identifiers to their current equivalents using a lookup dictionary.
