# libs/timebar/src/components/timerange-selector.tsx · [[time-range-picker-modal]] [[time-snapping-boundary-logic]]

A React component that provides an interactive UI for selecting custom date ranges with quick-select presets, input validation, and constraint-based field disabling.

- TimeRangeSelectorProps · type · L25-L39 — Configuration object type for the TimeRangeSelector component, specifying callbacks, date bounds, labels, and UI options.
- LastXOption · type · L42-L47 — Quick-select time period definition type representing a relative time span like 'last 30 days'.
- DateProperty · type · L49-L49 — Union type representing the three components of a date that can be edited: year, month, or day.
- DateInputValues · type · L51-L51 — Record type mapping date properties (year, month, day) to their numeric input values, allowing undefined for incomplete dates.
- DateInputValids · type · L52-L52 — Record type tracking validation state for each date component (year, month, day).
- TimerangeLabels · type · L54-L54 — Non-nullable type alias for user-facing label strings used throughout the time range selector UI.
- DateInputGroupProps · type · L56-L71 — Props type for a single date input trio (year/month/day), specifying all configuration needed to render and validate one side of the date range.
- DateInputGroup · function · L74-L160 — React component rendering a trio of labeled number inputs for year, month, and day with validation feedback and disable states.
- getDisabledFields · function · L162-L176 — Determines which date granularities (MONTH, DAY) should be disabled based on the time span between start and end dates exceeding configured limits.
- TimeRangeSelector · function · L178-L476 — Main React component that renders a portal-based panel for selecting a date range via manual inputs or quick-select buttons, with validation and submission.
- updatePosition · function · L194-L203 — Callback that positions the selector panel to align horizontally with an anchor element and updates on window resize.
- submit · function · L257-L290 — Processes selected start and end dates by applying granularity constraints and snapping to interval boundaries before invoking the onSubmit callback.
- onLastXSelect · function · L292-L309 — Handles quick-select option clicks by computing the corresponding date range and immediately submitting it.
- onDateChange · function · L311-L343 — Updates date input state on user keystroke, enforcing format rules, handling day-of-month overflow, and validating the resulting date.
- onDateBlur · function · L345-L355 — Clears invalid or empty date field values when focus leaves an input, resetting to undefined and marking as valid.
- onStartChange · function · L357-L358 — Partial application wrapper for onDateChange targeting the start date input values.
- onEndChange · function · L359-L360 — Partial application wrapper for onDateChange targeting the end date input values.
- onStartBlur · function · L361-L362 — Partial application wrapper for onDateBlur targeting the start date input values.
- onEndBlur · function · L363-L364 — Partial application wrapper for onDateBlur targeting the end date input values.
