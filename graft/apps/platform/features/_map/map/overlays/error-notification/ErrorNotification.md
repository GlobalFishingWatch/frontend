# apps/platform/features/_map/map/overlays/error-notification/ErrorNotification.tsx · [[error-notification-overlay]]

A React component that displays and manages error notifications on the map, allowing users to report errors with location and description data to a feedback API.

- ErrorNotification · function · L20-L119 — React component that renders an interactive error notification popup with input for error labels and confirmation submission to a feedback API.
- onClose · function · L28-L32 — Callback that closes the error notification popup and resets its associated state.
- onConfirmClick · function · L34-L74 — Async handler that submits error data including location, user info, and label to the feedback API endpoint and displays success feedback.
