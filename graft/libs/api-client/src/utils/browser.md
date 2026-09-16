# libs/api-client/src/utils/browser.ts · [[api-client-browser-utilities]] [[error-handling-cross-environment-resilience]]

Utility module providing browser environment detection, safe localStorage access, and debug URL logging.

- getIsBrowser · function · L1-L1 — Detects whether code is executing in a browser environment by checking for the presence of the window object.
- logDebugUrl · function · L32-L46 — Logs a URL to console, collapsing it if it exceeds the maximum length threshold to improve readability.
