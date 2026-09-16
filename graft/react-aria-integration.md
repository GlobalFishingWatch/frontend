---
name: React Aria Integration
slug: react-aria-integration
type: concept
sources:
  - path: libs/ui-components/src/modal/Modal.tsx
    hash: 92aeb5ed6bb6ac8e862aa2658038bfb5accbfbf2c4f3d901692c974c26fc51cd
  - path: libs/ui-components/src/slider-range/SliderRange.tsx
    hash: 2ce6c4f9a32cd2696dfa57e992461716db2abd823e40f0c7c183c40e5acb793f
  - path: libs/ui-components/src/slider/Slider.tsx
    hash: fb71493b806647ea91976a8e47dfad196c4d0ccada96ffe266ca616d7c42a67c
sources_digest: 154a00938e6704140a8be103b7129d8515c4cf762041b542d3b6e3b8b06c9ba3
links:
  - to: input-components
    relation: implements
    description: Slider and SliderRange use react-aria-components slider primitives
  - to: layout-container-components
    relation: implements
    description: Modal uses react-aria-components for accessible overlay handling
generator:
  version: 1
covers:
  - symbol: ModalBaseProps
    kind: type
    at: 'libs/ui-components/src/modal/Modal.tsx:L10-L20'
  - symbol: ModalProps
    kind: type
    at: 'libs/ui-components/src/modal/Modal.tsx:L27-L28'
  - symbol: Modal
    kind: function
    at: 'libs/ui-components/src/modal/Modal.tsx:L30-L93'
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

Shared dependency on react-aria-components for accessible UI primitives across Modal, Slider, and SliderRange components. React Aria provides ARIA-compliant keyboard handling, focus management, and semantic roles (e.g., role=slider for range controls, role=dialog for modals) without prescribing styling, enabling the components to maintain visual consistency while delegating accessibility mechanics. Both Slider and SliderRange build on react-aria's slider primitives (AriaSlider, SliderThumb, SliderTrack), while Modal wraps its overlay, modal, and dialog elements.

## Related

- implements [[input-components]] — Slider and SliderRange use react-aria-components slider primitives
- implements [[layout-container-components]] — Modal uses react-aria-components for accessible overlay handling

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
