---
name: Input Validation & Accessibility Pattern
slug: input-validation-accessibility-pattern
type: concept
sources:
  - path: libs/ui-components/src/input-date/InputDate.tsx
    hash: 944b3d9094aaa6383b0f4ff4313994815cdd42826c3bd00f5a3196c73e5122cc
  - path: libs/ui-components/src/input-text/InputText.tsx
    hash: 84882fd93e07eb7ace66ed78875add84b6e6775a5214a85d60122b65e9bc5454
  - path: libs/ui-components/src/radio/Radio.tsx
    hash: 50c9f6c37b03b4f3e0283e563cba448ee046fea4ffcf0935b1061ec482ca09a4
sources_digest: 934b6147e65252a2ca2a6dd62e3e2cc920f5b2db54b463297555b2a44ecffdeb
links:
  - to: input-components
    relation: implements
    description: All input components follow this dual-state validation pattern
  - to: tooltip-system
    relation: uses
    description: Components render Tooltip based on validation state for visual feedback
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
  - symbol: RadioProps
    kind: interface
    at: 'libs/ui-components/src/radio/Radio.tsx:L12-L21'
  - symbol: Radio
    kind: function
    at: 'libs/ui-components/src/radio/Radio.tsx:L23-L62'
---

<!-- context:generated:start -->

## Summary

Cross-cutting design pattern implemented consistently across all input components (InputText, InputDate, Radio, etc.) where validation state is managed dually: explicit invalid state passed via props AND native HTML5 validation state tracked internally. Components expose underlying input refs via useImperativeHandle, apply conditional CSS classes from shared modules (InputText.module.css), and render visual feedback (Tooltip, colors) based on validation status. The pattern enables flexible validation orchestration—parent can control explicit state while component also respects browser validation—but risks UI ambiguity if both states conflict.

## Related

- implements [[input-components]] — All input components follow this dual-state validation pattern
- uses [[tooltip-system]] — Components render Tooltip based on validation state for visual feedback

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
