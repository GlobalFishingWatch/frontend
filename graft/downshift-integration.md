---
name: Downshift Integration
slug: downshift-integration
type: concept
sources:
  - path: libs/ui-components/src/multi-select/MultiSelect.tsx
    hash: 8fcf6e1e0b43ef6d758e473b1de09aa57cabada64a249392c3ca8c9b2a206972
  - path: libs/ui-components/src/select/Select.tsx
    hash: 1d16552dab56d464002464a249832d2afa7226494694e9f21d87244f532705ea
sources_digest: 4196a9a0793670d5019575a7637a0567947e51c191863745f777a137dc86d917
links:
  - to: input-components
    relation: implements
    description: Select and MultiSelect use Downshift for accessible dropdown behavior
  - to: virtual-rendering
    relation: depends_on
    description: >-
      Both components pair Downshift with @tanstack/react-virtual for efficient
      rendering of large option lists
generator:
  version: 1
covers:
  - symbol: SelectOptionId
    kind: type
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L22-L22'
  - symbol: MultiSelectOption
    kind: type
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L23-L30'
  - symbol: MultiSelectOnChange
    kind: type
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L36-L39'
  - symbol: MultiSelectOnFilter
    kind: type
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L47-L51'
  - symbol: MultiSelectOnRemove
    kind: type
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L55-L55'
  - symbol: MultiSelectProps
    kind: interface
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L57-L76'
  - symbol: getPlaceholderBySelections
    kind: function
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L78-L92'
  - symbol: isItemSelected
    kind: function
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L94-L96'
  - symbol: getSearchableTextFromLabel
    kind: function
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L98-L105'
  - symbol: getItemsFiltered
    kind: function
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L107-L113'
  - symbol: MultiSelect
    kind: function
    at: 'libs/ui-components/src/multi-select/MultiSelect.tsx:L115-L403'
  - symbol: SelectProps
    kind: interface
    at: 'libs/ui-components/src/select/Select.tsx:L14-L34'
  - symbol: isItemSelected
    kind: function
    at: 'libs/ui-components/src/select/Select.tsx:L36-L38'
  - symbol: Select
    kind: function
    at: 'libs/ui-components/src/select/Select.tsx:L40-L224'
---

<!-- context:generated:start -->

## Summary

Shared dependency across Select and MultiSelect components that provides accessible dropdown state management, keyboard navigation, and combobox behavior via Downshift hooks (useSelect, useCombobox, useMultipleSelection). Both components leverage Downshift's stateReducer to customize behavior—e.g., suppressing input value population after selection, clearing input on escape. Downshift handles focus management, ARIA roles, and click-outside dismissal automatically, enabling both components to focus on filtering logic, virtual rendering, and custom styling without reimplementing accessibility mechanics.

## Related

- implements [[input-components]] — Select and MultiSelect use Downshift for accessible dropdown behavior
- depends on [[virtual-rendering]] — Both components pair Downshift with @tanstack/react-virtual for efficient rendering of large option lists

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
