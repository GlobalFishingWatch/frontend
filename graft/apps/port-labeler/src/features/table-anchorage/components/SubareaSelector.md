# apps/port-labeler/src/features/table-anchorage/components/SubareaSelector.tsx · [[table-anchorage-editing-interface]]

React component module for selecting and managing subarea options with filtering, custom naming, and color indicators.

- SubareaSelectOption · interface · L10-L12 — Extended select option type that adds an optional color property for visual differentiation of subarea items.
- SelectProps · interface · L14-L30 — Props interface defining the configuration for the SubareaSelector component including callbacks for selection, removal, and custom naming.
- isItemSelected · function · L32-L34 — Helper function that determines if a given item matches the currently selected option by comparing IDs.
- SubareaSelector · function · L36-L165 — Dropdown selector component that allows users to select a subarea from filtered options, add new ones, and rename selections with visual color indicators.
