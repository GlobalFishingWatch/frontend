# apps/platform/features/_map/workspace/shared/OutOfBoundsDisclaimer.tsx · [[time-range-validation]]

React component that displays a disclaimer warning when a dataview's available dataset time extent falls outside the selected time range, with special handling for VIIRS layers.

- OutOfTimerangeDisclaimerValidate · type · L23-L23 — Type union specifying which boundaries (start, end, or both) the disclaimer should validate against dataset extent.
- OutOfTimerangeDisclaimerProps · type · L24-L28 — Props interface for the disclaimer component, configuring validation mode, dataview instance, and optional CSS class.
- OutOfTimerangeDisclaimer · function · L30-L110 — React component that displays a warning when the user's selected time range falls outside the available data extent for a given dataview, with special handling for VIIRS layers.
