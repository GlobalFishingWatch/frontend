# apps/image-labeler/src/features/projects-list/ProjectForm.tsx · [[form-based-crud-workflows-with-modal-encapsulation]] [[image-labeler-project-management-ui]]

React component module for a form that creates or edits image labeling projects with metadata like name, labels, BigQuery configurations, and GCS thumbnail paths.

- ProjectForm · function · L11-L146 — React functional component that renders a form for creating or editing labeling projects with validation and API mutation handling.
- handleChange · function · L27-L29 — Updates a single field in the project info state object.
- saveProject · function · L31-L38 — Persists project changes by calling either the create or edit API mutation, then reloads the page on success or displays error messages.
