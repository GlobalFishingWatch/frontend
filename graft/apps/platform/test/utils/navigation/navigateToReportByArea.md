# apps/platform/test/utils/navigation/navigateToReportByArea.ts · [[test-navigation-utilities]]

Test utility module that provides navigation helpers to generate workspace report routes for different marine protected area types (EEZ, MPA, RFMO).

- DatasetId · type · L21-L21 — Union type constraining dataset identifiers to the three supported area classification systems.
- EEZNames · type · L28-L28 — Union type enumerating named exclusive economic zones available for report navigation.
- MPANames · type · L30-L30 — Union type enumerating named marine protected areas available for report navigation.
- RFMONames · type · L32-L32 — Union type enumerating named regional fisheries management organizations available for report navigation.
- navigateToReport · function · L35-L53 — Constructs a workspace report navigation configuration for a specified dataset and area, with customizable map view parameters.
- ReportArea · type · L55-L55 — Union type constraining report navigation to the three geographic area classification types.
- navigateToReportByArea · function · L56-L67 — Routes report navigation requests to the appropriate dataset and predefined area based on the specified geographic area type.
