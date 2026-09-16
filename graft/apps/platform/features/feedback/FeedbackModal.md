# apps/platform/features/feedback/FeedbackModal.tsx · [[feedback-bug-reporting]]

React component module that provides a feedback submission form with user data collection, workspace/report creation, and API submission.

- FeedbackModalProps · type · L36-L39 — Type definition for FeedbackModal component props controlling visibility and close behavior.
- FeedbackData · type · L41-L55 — Type definition for the feedback form data structure containing user metadata, form inputs, and context information.
- FeedbackModal · function · L82-L341 — React component that renders a modal form for collecting user feedback, managing form state, and handling submission with optional workspace/report creation.
- setInitialFeedbackStateWithUserData · function · L104-L116 — Initializes feedback form state with environment data and authenticated user information when available.
- onFieldChange · function · L162-L170 — Updates feedback form field value and resets dependent fields when feedback type changes.
- sendFeedback · function · L172-L249 — Submits feedback to the backend API after optionally creating a workspace or report for non-guest users to preserve their context.
