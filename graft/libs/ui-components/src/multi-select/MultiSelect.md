# libs/ui-components/src/multi-select/MultiSelect.tsx · [[downshift-integration]] [[input-components]] [[virtual-rendering]]

A reusable React multi-select dropdown component with filtering, virtualization, and keyboard navigation via Downshift.

- SelectOptionId · type · L22-L22 — Type alias for unique identifiers of selectable options.
- MultiSelectOption · type · L23-L30 — Data structure defining a selectable option with metadata like label, tooltip, and selection constraints.
- MultiSelectOnChange · type · L36-L39 — Callback type invoked when an option is selected or removed from the multi-select.
- MultiSelectOnFilter · type · L47-L51 — Callback type that applies custom filtering logic to transform available options based on user input.
- MultiSelectOnRemove · type · L55-L55 — Callback type invoked when the clear-all button is clicked to remove all selected options.
- MultiSelectProps · interface · L57-L76 — Configuration properties interface for the MultiSelect component.
- getPlaceholderBySelections · function · L78-L92 — Generates placeholder text displaying selected options or a count summary.
- isItemSelected · function · L94-L96 — Checks whether a given option is present in the list of selected items.
- getSearchableTextFromLabel · function · L98-L105 — Extracts searchable text from option labels, handling both string and JSX.Element formats.
- getItemsFiltered · function · L107-L113 — Filters options using fuzzy matching against id, alias, and label fields.
- MultiSelect · function · L115-L403 — Main component that renders a searchable multi-select dropdown with virtual scrolling and handles user interactions.
