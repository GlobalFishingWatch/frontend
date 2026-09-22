# apps/platform/server-functions/screen-size.functions.ts · [[async-local-request-context-pattern]] [[layout-preference-persistence]]

Server-side module for detecting and constraining panel layout dimensions (sidebar width percentage, content panel width, and screen width) from HTTP request cookies.

- clampAsidePct · function · L7-L7 — Constrains a sidebar width percentage to stay within the allowed 33–66% range.
- clampContentPanelWidth · function · L11-L12 — Constrains a content panel width in pixels to stay within the allowed 320–800px range.
- detectPanelWidthsFromRequest · function · L14-L33 — Extracts panel width preferences from request cookies and returns clamped values for sidebar percentage, content panel width, and screen width.
- getPanelWidthsFromRequest · function · L35-L38 — Async wrapper that retrieves the current server request and detects panel widths from its cookies.
