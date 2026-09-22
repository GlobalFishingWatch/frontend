# apps/platform/features/_user/vessel-groups/vessel-groups-migration.hooks.ts · [[dataset-dataview-integration]] [[vessel-group-vessel-identity-reconciliation]] [[vessel-groups-management-system]]

Hooks and utilities for migrating vessel groups to use current datasets and managing deprecated or deleted dataset handling.

- getVesselGroupDatasetStatus · function · L40-L55 — Determines whether a vessel group has deprecated, deleted, or outdated datasets by checking dataset migration status.
- useVesselGroupDatasetStatus · function · L57-L69 — React hook that retrieves deprecated and deleted dataset selectors from Redux to evaluate vessel group dataset status.
- AddVesselGroupVessel · type · L75-L76 — Type union representing any vessel data shape that can be added to a vessel group.
- useMigrateToLatestVesselGroup · function · L78-L134 — React hook that migrates outdated vessel groups by fetching their vessels, detecting datasource types, and populating a modal form with migrated vessel identifiers.
