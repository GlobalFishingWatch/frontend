# apps/platform/features/_reports/reports.types.ts · [[report-state-configuration]]

Type definitions for report configuration, state management, and filtering across activities, events, vessels, and areas.

- ReportCategory · enum · L21-L29 — Enumeration of top-level report types that organize reporting functionality.
- ReportCategoryState · type · L30-L33 — Holds the currently selected top-level report category.
- ReportActivitySubCategory · type · L45-L46 — Defines activity report sub-categories for fishing and presence dataset filtering.
- ReportDetectionsSubCategory · type · L47-L48 — Defines detection report sub-categories for satellite and radar imagery types.
- ReportEventsSubCategory · type · L49-L49 — Defines event report sub-categories based on event types.
- ReportVesselsSubCategory · type · L50-L50 — Defines vessel report sub-categories for graph type, source, and coverage views.
- AnyReportSubCategory · type · L52-L56 — Union type of all possible report sub-category types across different report categories.
- ReportSubcategoryState · type · L58-L67 — Holds the currently selected sub-category filters for each report type.
- AreaReportState · type · L70-L81 — Manages geographic area bounds, buffering, and operation parameters for area-based reports.
- PortsReportState · type · L84-L91 — Stores port-specific metadata including name, country code, and dataset identifier for port reports.
- ReportVesselOrderProperty · type · L95-L95 — Type-safe representation of vessel ordering column options.
- ReportVesselOrderDirection · type · L97-L97 — Type-safe representation of vessel list sort direction options.
- ReportVesselGraph · type · L98-L101 — Defines the available graph visualization types for vessel reports.
- ReportVesselsState · type · L105-L126 — Manages vessel report state including filtering, sorting, pagination, and selected graph type.
- ReportActivityGraph · type · L128-L132 — Defines the available chart visualization types for activity reports.
- ReportEventsGraph · type · L135-L140 — Defines the available chart visualization types and grouping options for event reports.
- ReportActivityTimeComparison · type · L142-L147 — Stores date ranges and duration parameters for activity report before/after and period comparisons.
- ReportComparisonDataviews · type · L149-L152 — Identifies the primary and comparison dataviews for activity dataset comparison visualizations.
- ReportActivityState · type · L154-L161 — Manages activity report state including chart type and comparison parameters.
- ReportEventsState · type · L163-L172 — Manages event report state including chart type, port filtering, and pagination.
- ReportState · type · L174-L180 — Complete report state union combining category, subcategory, vessel, activity, event, area, and port states.
- ReportStateProperty · type · L182-L182 — Type utility that provides all possible report state property keys.
