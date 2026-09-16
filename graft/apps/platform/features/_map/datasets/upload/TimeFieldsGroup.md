# apps/platform/features/_map/datasets/upload/TimeFieldsGroup.tsx · [[dataset-upload-and-parsing]] [[timestamp-property-consistency-across-upload-path]]

Renders a form group for configuring time-based filtering options (date, dateRange, or none) on dataset uploads, managing the selection and lifecycle of time field properties.

- TimeFilterTypeOption · type · L16-L16 — Type alias representing the available time filter modes for dataset configuration.
- getTimeFilterOptions · function · L19-L26 — Transforms a list of time filter type identifiers into localized dropdown select options.
- TimeFieldsGroupProps · type · L28-L33 — Props interface defining the configuration inputs for the TimeFieldsGroup component.
- TimeFieldsGroup · function · L35-L197 — React component that renders conditional time field selectors based on the chosen time filter type, managing the configuration of timestamp, start time, and end time properties.
