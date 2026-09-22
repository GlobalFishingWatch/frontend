# libs/ui-components/src/download-survey/downloadSurvey.utils.ts · [[download-survey-component]]

Utility module for submitting download survey responses with user metadata to a backend endpoint.

- DownloadSurveyPayload · type · L5-L13 — Type defining the complete payload structure for a download survey submission, combining survey answers with user and organization metadata.
- SubmitDownloadSurveyParams · type · L15-L20 — Type defining the parameters required to submit a download survey, including the endpoint URL, survey answer, user data, and optional group affiliations.
- submitDownloadSurvey · function · L22-L47 — Async function that constructs a survey payload from user and answer data and POSTs it to a specified endpoint, throwing an error if the response fails.
