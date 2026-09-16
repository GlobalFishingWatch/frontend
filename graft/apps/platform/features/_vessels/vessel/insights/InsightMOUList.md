# apps/platform/features/_vessels/vessel/insights/InsightMOUList.tsx · [[authentication-gating-in-insights]] [[insight-data-loading-error-handling]] [[vessel-insights-display-system]]

React component that displays a vessel's appearance on Tokyo and Paris MOU (Memorandum of Understanding) inspection lists with aggregation by vessel flag reference and detection status.

- InsightMOUList · function · L17-L194 — React component that renders MOU list insights for a vessel, aggregating black/grey list appearances and displaying them with guest/loading/error states.
- getMOUListAppearance · function · L68-L172 — Builds a list of translated messages describing the vessel's current and historical appearances in Tokyo and Paris MOU black and grey inspection lists.
