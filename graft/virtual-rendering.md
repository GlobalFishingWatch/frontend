---
name: Virtual Rendering
slug: virtual-rendering
type: concept
sources:
  - path: libs/ui-components/src/multi-select/MultiSelect.tsx
    hash: 8fcf6e1e0b43ef6d758e473b1de09aa57cabada64a249392c3ca8c9b2a206972
  - path: libs/ui-components/src/select/Select.tsx
    hash: 1d16552dab56d464002464a249832d2afa7226494694e9f21d87244f532705ea
sources_digest: 4196a9a0793670d5019575a7637a0567947e51c191863745f777a137dc86d917
links:
  - to: downshift-integration
    relation: depends_on
    description: >-
      Virtual rendering is paired with Downshift for complete accessible and
      performant dropdown UX
  - to: input-components
    relation: implements
    description: >-
      Select and MultiSelect use virtual rendering for efficient option list
      display
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

Performance optimization pattern applied to Select and MultiSelect components using @tanstack/react-virtual's useVirtualizer hook to render only visible items in a scrollable viewport (e.g., 24rem height). Both components calculate item heights, absolute positions, and transform offsets to efficiently handle hundreds or thousands of options with minimal DOM overhead. Virtual rendering is essential for both components' usability at scale—without it, rendering all options upfront would cause UI lag and memory pressure.

## Related

- depends on [[downshift-integration]] — Virtual rendering is paired with Downshift for complete accessible and performant dropdown UX
- implements [[input-components]] — Select and MultiSelect use virtual rendering for efficient option list display

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
