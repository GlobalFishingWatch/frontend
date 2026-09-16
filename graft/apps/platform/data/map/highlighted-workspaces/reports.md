# apps/platform/data/map/highlighted-workspaces/reports.ts · [[workspace-layer-library-defaults]]

Defines highlighted report workspace configurations and types for the map platform, including fishing activity and report categories.

- ReportWorkspaceId · type · L14-L14 — Type alias that constrains report workspace IDs to keys available in the localized workspaces translations.
- WorkspaceReportLink · type · L15-L17 — Simple object type that associates a report by its string identifier.
- ReportWorkspace · type · L18-L33 — Discriminated union type that describes a report workspace as either a fishing activity workspace with nested reports or a report category workspace with dataview instances.
