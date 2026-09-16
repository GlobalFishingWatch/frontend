# apps/platform/features/_reports/report-area/title/ReportTitle.tsx · [[area-report-ui-components]] [[map-viewport-and-timebar-integration]]

React component that displays the report title, area information, description, and provides controls for buffering the report area and printing.

- ReportTitle · function · L55-L326 — Main React component that displays the report title, report area size, buffer manipulation controls, print button, and optional report description with expansion toggle.
- onAfterPrint · function · L118-L118 — Event handler that disables print mode after the browser print dialog closes.
- onPrintClick · function · L123-L132 — Handler that triggers print mode by closing the side panel, fitting the area in viewport, tracking the event, and initiating the browser print dialog.
