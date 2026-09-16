---
name: Time Range Picker Modal
slug: time-range-picker-modal
type: system
sources:
  - path: libs/timebar/src/components/timerange-button.tsx
    hash: 1382e391c782558621f67efc891c167364e293c259a27fc9db9c04ec858516b2
  - path: libs/timebar/src/components/timerange-selector.spec.tsx
    hash: 8153b2be829da613f3fcd371240317d9320cc18de48cabb9c2dcde2b5e0d2d7d
  - path: libs/timebar/src/components/timerange-selector.tsx
    hash: a73e381a1129fafdd4d5e841edfab8e86ce0b9c66c2d998bbc19a6a376932fe4
sources_digest: dba99bfab8c8536a4020f7ab38b2c5580a5f8c3170b9fd578f52204a9904ea16
links:
  - to: time-snapping-boundary-logic
    relation: uses
    description: >-
      TimeRangeSelector uses LIMITS_BY_INTERVAL and getFourwingsInterval to
      disable date fields that are too granular for the selected span;
      getDisabledFields implements this logic
  - to: timebar-main-component
    relation: implements
    description: >-
      Both are child components; consume useTimebar to read bounds and emit
      range changes
generator:
  version: 1
covers:
  - symbol: TimebarTimeRangeSelectorProps
    kind: type
    at: 'libs/timebar/src/components/timerange-button.tsx:L14-L18'
  - symbol: TimebarTimeRangeSelector
    kind: function
    at: 'libs/timebar/src/components/timerange-button.tsx:L20-L70'
  - symbol: TimeRangeSelectorProps
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L25-L39'
  - symbol: LastXOption
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L42-L47'
  - symbol: DateProperty
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L49-L49'
  - symbol: DateInputValues
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L51-L51'
  - symbol: DateInputValids
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L52-L52'
  - symbol: TimerangeLabels
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L54-L54'
  - symbol: DateInputGroupProps
    kind: type
    at: 'libs/timebar/src/components/timerange-selector.tsx:L56-L71'
  - symbol: DateInputGroup
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L74-L160'
  - symbol: getDisabledFields
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L162-L176'
  - symbol: TimeRangeSelector
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L178-L476'
  - symbol: updatePosition
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L194-L203'
  - symbol: submit
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L257-L290'
  - symbol: onLastXSelect
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L292-L309'
  - symbol: onDateChange
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L311-L343'
  - symbol: onDateBlur
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L345-L355'
  - symbol: onStartChange
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L357-L358'
  - symbol: onEndChange
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L359-L360'
  - symbol: onStartBlur
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L361-L362'
  - symbol: onEndBlur
    kind: function
    at: 'libs/timebar/src/components/timerange-selector.tsx:L363-L364'
---

<!-- context:generated:start -->

## Summary

Modal UI for manual date entry and quick-select presets (last 30 days, last 3 months, etc.). TimeRangeSelector component renders portaled date input fields and preset buttons; TimebarTimeRangeSelector button wrapper triggers modal visibility and persists selections through Timebar context.

## Related

- uses [[time-snapping-boundary-logic]] — TimeRangeSelector uses LIMITS_BY_INTERVAL and getFourwingsInterval to disable date fields that are too granular for the selected span; getDisabledFields implements this logic
- implements [[timebar-main-component]] — Both are child components; consume useTimebar to read bounds and emit range changes

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
