---
name: Input Components
slug: input-components
type: system
sources:
  - path: libs/ui-components/src/input-date/index.ts
    hash: 00a95d8b3453c4e5a2e72e204149df99ea991d8d2ff72e9584207a5d14df925e
  - path: libs/ui-components/src/input-date/InputDate.tsx
    hash: 944b3d9094aaa6383b0f4ff4313994815cdd42826c3bd00f5a3196c73e5122cc
  - path: libs/ui-components/src/input-text/index.ts
    hash: 779255e7d74491bbb153c527496a036bf90e6abd5dbb9fc39904dd4015ada26f
  - path: libs/ui-components/src/input-text/InputText.tsx
    hash: 84882fd93e07eb7ace66ed78875add84b6e6775a5214a85d60122b65e9bc5454
  - path: libs/ui-components/src/multi-select/index.ts
    hash: de181d766cef1fe539a7bee66ce156a45a6a0442c3df98c078bd1d611f134c20
  - path: libs/ui-components/src/multi-select/MultiSelect.tsx
    hash: 8fcf6e1e0b43ef6d758e473b1de09aa57cabada64a249392c3ca8c9b2a206972
  - path: libs/ui-components/src/radio/index.ts
    hash: 5bb9a800249fdfe16c6ccfa0bf9266c498190abd7167dd91648a101e3c7692b7
  - path: libs/ui-components/src/radio/Radio.tsx
    hash: 50c9f6c37b03b4f3e0283e563cba448ee046fea4ffcf0935b1061ec482ca09a4
  - path: libs/ui-components/src/select/index.ts
    hash: 63daeaf2d136579037a8519d28c0261c34b1a89fed75e233e1a851eeae80da79
  - path: libs/ui-components/src/select/Select.tsx
    hash: 1d16552dab56d464002464a249832d2afa7226494694e9f21d87244f532705ea
  - path: libs/ui-components/src/slider-range/index.ts
    hash: 196769f4a886573689b074d6eb2ab397a75083210785f444d5b7187af049a363
  - path: libs/ui-components/src/slider-range/SliderRange.tsx
    hash: 2ce6c4f9a32cd2696dfa57e992461716db2abd823e40f0c7c183c40e5acb793f
  - path: libs/ui-components/src/slider/index.ts
    hash: 0db47e2b2f6b3f78f64da350847f667a698cfe51204ac562be4f28439940ab5a
  - path: libs/ui-components/src/slider/Slider.tsx
    hash: fb71493b806647ea91976a8e47dfad196c4d0ccada96ffe266ca616d7c42a67c
sources_digest: d965f07e668f0be3d193c83c1fee4645a368f85774d0ef14e3218bcd01206c97
links:
  - to: downshift-integration
    relation: depends_on
    description: >-
      Select and MultiSelect components depend on Downshift for accessible
      dropdown state and keyboard navigation
  - to: icon-system
    relation: uses
    description: >-
      Input components depend on Icon for visual indicators (password toggle,
      loading spinners, delete buttons)
  - to: input-validation-accessibility-pattern
    relation: implements
    description: >-
      All input components follow a consistent pattern of managing validation
      state (native and explicit), exposing refs via useImperativeHandle, and
      applying shared CSS modules
  - to: react-aria-integration
    relation: depends_on
    description: >-
      Slider and SliderRange components build on react-aria-components for
      accessible slider primitives
  - to: tooltip-system
    relation: uses
    description: >-
      All input components integrate Tooltip for validation feedback, help text,
      and field labels
  - to: virtual-rendering
    relation: depends_on
    description: >-
      Select and MultiSelect use @tanstack/react-virtual to efficiently render
      large option lists
generator:
  version: 1
covers:
  - symbol: InputDateProps
    kind: type
    at: 'libs/ui-components/src/input-date/InputDate.tsx:L12-L26'
  - symbol: InputDateComponent
    kind: function
    at: 'libs/ui-components/src/input-date/InputDate.tsx:L30-L98'
  - symbol: InputSize
    kind: type
    at: 'libs/ui-components/src/input-text/InputText.tsx:L13-L13'
  - symbol: InputType
    kind: type
    at: 'libs/ui-components/src/input-text/InputText.tsx:L14-L14'
  - symbol: InputTextProps
    kind: type
    at: 'libs/ui-components/src/input-text/InputText.tsx:L16-L31'
  - symbol: InputTextComponent
    kind: function
    at: 'libs/ui-components/src/input-text/InputText.tsx:L35-L127'
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
  - symbol: RadioProps
    kind: interface
    at: 'libs/ui-components/src/radio/Radio.tsx:L12-L21'
  - symbol: Radio
    kind: function
    at: 'libs/ui-components/src/radio/Radio.tsx:L23-L62'
  - symbol: SelectProps
    kind: interface
    at: 'libs/ui-components/src/select/Select.tsx:L14-L34'
  - symbol: isItemSelected
    kind: function
    at: 'libs/ui-components/src/select/Select.tsx:L36-L38'
  - symbol: Select
    kind: function
    at: 'libs/ui-components/src/select/Select.tsx:L40-L224'
  - symbol: SelectOption
    kind: type
    at: 'libs/ui-components/src/select/index.ts:L7-L14'
  - symbol: SelectOnChange
    kind: type
    at: 'libs/ui-components/src/select/index.ts:L19-L19'
  - symbol: SelectOnRemove
    kind: type
    at: 'libs/ui-components/src/select/index.ts:L23-L23'
  - symbol: SliderRangeValues
    kind: type
    at: 'libs/ui-components/src/slider-range/SliderRange.tsx:L12-L12'
  - symbol: SliderRangeConfig
    kind: type
    at: 'libs/ui-components/src/slider-range/SliderRange.tsx:L13-L17'
  - symbol: SliderRangeProps
    kind: interface
    at: 'libs/ui-components/src/slider-range/SliderRange.tsx:L18-L32'
  - symbol: Precision
    kind: type
    at: 'libs/ui-components/src/slider-range/SliderRange.tsx:L33-L33'
  - symbol: SliderRange
    kind: function
    at: 'libs/ui-components/src/slider-range/SliderRange.tsx:L65-L226'
  - symbol: SliderThumbsSize
    kind: type
    at: 'libs/ui-components/src/slider/Slider.tsx:L10-L10'
  - symbol: SliderConfig
    kind: type
    at: 'libs/ui-components/src/slider/Slider.tsx:L11-L16'
  - symbol: SliderProps
    kind: interface
    at: 'libs/ui-components/src/slider/Slider.tsx:L17-L30'
  - symbol: Slider
    kind: function
    at: 'libs/ui-components/src/slider/Slider.tsx:L48-L142'
---

<!-- context:generated:start -->

## Summary

Form input elements including text, date, select, multi-select, slider, and radio components with consistent validation, accessibility, and interactive features. Uses shared Tooltip and Icon components for visual feedback and implements a unified sizing/styling convention across all input types.

## Related

- depends on [[downshift-integration]] — Select and MultiSelect components depend on Downshift for accessible dropdown state and keyboard navigation
- uses [[icon-system]] — Input components depend on Icon for visual indicators (password toggle, loading spinners, delete buttons)
- implements [[input-validation-accessibility-pattern]] — All input components follow a consistent pattern of managing validation state (native and explicit), exposing refs via useImperativeHandle, and applying shared CSS modules
- depends on [[react-aria-integration]] — Slider and SliderRange components build on react-aria-components for accessible slider primitives
- uses [[tooltip-system]] — All input components integrate Tooltip for validation feedback, help text, and field labels
- depends on [[virtual-rendering]] — Select and MultiSelect use @tanstack/react-virtual to efficiently render large option lists

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
