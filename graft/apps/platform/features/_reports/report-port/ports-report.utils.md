# apps/platform/features/_reports/report-port/ports-report.utils.ts · [[port-report-ui-components]]

Utility module that provides functions to filter, configure, and clean port cluster dataviews for reports.

- isPortClusterDataviewForReport · function · L6-L8 — Checks whether a dataview is a port cluster dataview by verifying the presence of the port visits events source ID.
- getPortClusterDataviewForReport · function · L10-L37 — Transforms a port cluster dataview by applying custom port ID, cluster zoom levels, and visibility settings while preserving other configuration.
- cleanPortClusterDataviewFromReport · function · L39-L48 — Removes report-specific port ID and cluster zoom level customizations from a dataview, restoring it to a clean state.
