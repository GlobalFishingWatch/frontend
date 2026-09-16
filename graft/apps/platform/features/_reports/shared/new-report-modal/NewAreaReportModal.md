# apps/platform/features/_reports/shared/new-report-modal/NewAreaReportModal.tsx · [[data-normalization-state-merging]] [[new-report-modal]]

Module providing a React modal component for creating and editing area reports with name, description, timerange, and view access configuration.

- NewReportModalProps · type · L37-L42 — Props type for the NewReportModal component controlling modal visibility, close behavior, completion callback, and optional edit-mode report data.
- NewReportModal · function · L44-L244 — React modal component that manages creating a new area report or editing an existing one, handling name, description, timerange selection, and visibility settings.
- localizeReportString · function · L58-L59 — Converts report name or description to locale-specific format for curated reports or decodes the value for regular users based on their GFW user status.
- updateReport · function · L82-L108 — Dispatches an update action to modify an existing report with new name, description, and workspace state, then invokes the completion callback on success.
- createReport · function · L110-L149 — Dispatches a create action to save a new report with name, description, dataset/area identifiers, workspace state, and public access flag, handling duplicate-name and generic errors.
- onDaysFromLatestChange · function · L151-L156 — Updates the report name when the days-from-latest input changes and the value has been modified by the handler.
- onSelectTimeRangeChange · function · L158-L163 — Updates the report name when the timerange selection changes and the value has been modified by the handler.
