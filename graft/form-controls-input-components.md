---
name: Form Controls & Input Components
slug: form-controls-input-components
type: system
sources:
  - path: libs/ui-components/src/checkbox/Checkbox.tsx
    hash: 83cae493174bdea395b6c6c111cfb32599eb6a40dc6f2292f84c1ec2909246da
  - path: libs/ui-components/src/choice/Choice.tsx
    hash: ee6dc7b8e6662744c189490462b56a5355fa8ea50262ed044d60c4e503abf2ae
  - path: libs/ui-components/src/collapsable/Collapsable.tsx
    hash: a227e34c5604342c3787b3c36d09ae58d8b4a9f2cd6944472a7de7a38ebb183d
sources_digest: 2fdeb35fcc426c2d9d343857aca9b092f108c913f164ea009200f4576998d560
links:
  - to: responsive-overflow-detection-pattern
    relation: implements
    description: >-
      Choice uses ResizeObserver and hidden measurement DOM to detect container
      overflow; when exceeded, remaps to Select dropdown to maintain usability
generator:
  version: 1
covers:
  - symbol: CheckboxProps
    kind: interface
    at: 'libs/ui-components/src/checkbox/Checkbox.tsx:L14-L24'
  - symbol: Checkbox
    kind: function
    at: 'libs/ui-components/src/checkbox/Checkbox.tsx:L26-L70'
  - symbol: ChoiceOption
    kind: type
    at: 'libs/ui-components/src/choice/Choice.tsx:L13-L13'
  - symbol: ChoiceProps
    kind: interface
    at: 'libs/ui-components/src/choice/Choice.tsx:L15-L26'
  - symbol: Choice
    kind: function
    at: 'libs/ui-components/src/choice/Choice.tsx:L28-L176'
  - symbol: onOptionClickHandle
    kind: function
    at: 'libs/ui-components/src/choice/Choice.tsx:L81-L86'
  - symbol: CollapsableProps
    kind: interface
    at: 'libs/ui-components/src/collapsable/Collapsable.tsx:L9-L17'
  - symbol: Collapsable
    kind: function
    at: 'libs/ui-components/src/collapsable/Collapsable.tsx:L19-L40'
  - symbol: handleToggle
    kind: function
    at: 'libs/ui-components/src/collapsable/Collapsable.tsx:L22-L27'
---

<!-- context:generated:start -->

## Summary

Collection of input and form components (Checkbox, Choice, Collapsable) that provide controlled and native element-based interactions. Checkbox uses role=checkbox with custom styling over native HTML, Choice falls back to Select dropdown on overflow via ResizeObserver, and Collapsable leverages native <details>/<summary> elements for semantic collapsible sections.

## Related

- implements [[responsive-overflow-detection-pattern]] — Choice uses ResizeObserver and hidden measurement DOM to detect container overflow; when exceeded, remaps to Select dropdown to maintain usability

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
