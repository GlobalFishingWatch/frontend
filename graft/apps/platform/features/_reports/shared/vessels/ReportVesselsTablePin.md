# apps/platform/features/_reports/shared/vessels/ReportVesselsTablePin.tsx · [[report-visualization-components]]

React component that provides a button to pin or unpin all vessels in a report table, with support for GFW users and vessel capacity limits.

- ReportVesselTablePinProps · type · L19-L22 — Defines the props shape for the vessel pinning button component, accepting a list of vessels and an optional callback for pin/unpin actions.
- ReportVesselsTablePinAll · function · L24-L97 — React component that renders a toggle button to pin all unpinned vessels or unpin all vessels in a report, with validation for user type, vessel limit, and async pinning state.
- handleOnClick · function · L42-L61 — Async handler that pins non-pinned vessels to the workspace or unpins all vessels, dispatching state updates and invoking the optional callback.
