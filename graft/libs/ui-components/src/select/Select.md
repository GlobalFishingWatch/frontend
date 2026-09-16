# libs/ui-components/src/select/Select.tsx · [[downshift-integration]] [[input-components]] [[virtual-rendering]]

This file exports a Select component that provides a dropdown menu with virtualized option rendering, support for selection/deselection, and customizable styling and behavior.

- SelectProps · interface · L14-L34 — Defines configuration properties for the Select component including options, event handlers, styling, and behavior controls.
- isItemSelected · function · L36-L38 — Determines whether a given option matches the currently selected item by comparing their IDs.
- Select · function · L40-L224 — Renders a virtualized dropdown select component with keyboard navigation, optional item removal, and conditional display of error/info states.
