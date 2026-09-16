# libs/ui-components/src/slider-range/SliderRange.tsx · [[input-components]] [[react-aria-integration]]

A controlled range slider component that allows users to select min/max values within a configurable range, with optional histogram visualization and text input fields.

- SliderRangeValues · type · L12-L12 — Type alias representing a numeric array used to hold the minimum and maximum values of a slider range.
- SliderRangeConfig · type · L13-L17 — Configuration object type that defines the numeric range bounds and preset step options for the slider.
- SliderRangeProps · interface · L18-L32 — Props interface defining configuration options for the SliderRange component including range values, callbacks, visual settings, and optional features.
- Precision · type · L33-L33 — Enumeration type representing three levels of numeric precision (high, mid, low) to control rounding and step size behavior.
- SliderRange · function · L65-L226 — React component that renders an interactive dual-handle range slider with precision-based rounding, optional input controls, and dynamic track background styling.
