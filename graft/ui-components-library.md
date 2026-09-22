---
name: UI Components Library
slug: ui-components-library
type: system
sources:
  - path: libs/ui-components/src/button/Button.tsx
    hash: ea97b2d3ad987c5747becd1e41c73dbd905898c403970f4cae0e2c48e7e53b9f
  - path: libs/ui-components/src/button/index.ts
    hash: 09cba733866a92cbb2bff3b5551f4b5a8f88827c1d682814b63f5d22eedf3ba0
  - path: libs/ui-components/src/card/Card.tsx
    hash: 139f848753ddf302cef90dc9589f850d7bd5c8fe69e77fa5cb055f16bab4c9c4
  - path: libs/ui-components/src/card/index.ts
    hash: 154b99d2f0fc91eae9e8be599f1084dd1cb2d80b56b790289b412c4c92a74c5a
  - path: libs/ui-components/src/carousel/Carousel.tsx
    hash: 969a4a944bf8edf04e8ffe8161ca1fe9eb7fe328c642d4350060572fffe2d68e
  - path: libs/ui-components/src/carousel/index.ts
    hash: c833c344de8778c5cf297026de2091733a1b729f629de8b12509ff978be4e4f1
  - path: libs/ui-components/src/checkbox/Checkbox.tsx
    hash: 83cae493174bdea395b6c6c111cfb32599eb6a40dc6f2292f84c1ec2909246da
  - path: libs/ui-components/src/checkbox/index.ts
    hash: 4e6666daa89d0c40168357588371345eb15163042c5fa1f00a947d6b2e420bcc
  - path: libs/ui-components/src/choice/Choice.tsx
    hash: ee6dc7b8e6662744c189490462b56a5355fa8ea50262ed044d60c4e503abf2ae
  - path: libs/ui-components/src/choice/index.ts
    hash: 2d81dd1e9d0ea0b6c37d64d13040342368231f7069f552349293b28b799a10a2
  - path: libs/ui-components/src/collapsable/Collapsable.tsx
    hash: a227e34c5604342c3787b3c36d09ae58d8b4a9f2cd6944472a7de7a38ebb183d
  - path: libs/ui-components/src/collapsable/index.ts
    hash: 4b67361a569fd0c3f12bd012f1871b8d640f73f5939fbe188d7072ecd615c3f2
  - path: libs/ui-components/src/dom-ids.ts
    hash: 9eb746ba6fe2849bbe8ce2872587eadbacac8973516a69ea4d6f0bca34723ec9
  - path: libs/ui-components/src/footer/footer.tsx
    hash: 5cffeb6de856de8d3e4175b3defc89c4d3aa91093dae0c81771d507aab896539
  - path: libs/ui-components/src/footer/index.ts
    hash: a8fab1138439553ac53c874609e506c7f1c6a2893a472e5b711fc41ba8a52913
  - path: libs/ui-components/src/icon-button/IconButton.tsx
    hash: 632fe4c391aaaaf58f6d1fd5c614122f9c51aa979cb80a17e241d484900d404b
  - path: libs/ui-components/src/icon-button/index.ts
    hash: 5a49529ec26565405080679e5966fa60dbf564a6daf42c55cb8fad8e21f16dce
  - path: libs/ui-components/src/icon/icon.config.ts
    hash: 3c6ec0a35bf52afa20b1ed678852d82d581d5ec72972dfb02c62af17746e916c
  - path: libs/ui-components/src/icon/Icon.tsx
    hash: 83b9ae048deb4002b6be4c4c5ef674a90d5bd75f08673bee26c230f80360ea55
sources_digest: b8b7b55014272a762a9b659432f3651524bc4a0fb0ec4083f30efc31bb36b869
links:
  - to: color-theme-configuration
    relation: depends_on
    description: >-
      Components rely on color-bar options and CSS custom properties for
      theming; ColorBar and IconButton read --color-danger-red at runtime for
      dynamic styling
  - to: icon-system
    relation: depends_on
    description: >-
      Icon, IconButton, Button, and other components consume IconType from
      icon.config for type-safe icon selection and dynamic SVG loading
generator:
  version: 1
covers:
  - symbol: ButtonType
    kind: type
    at: 'libs/ui-components/src/button/Button.tsx:L11-L11'
  - symbol: ButtonSize
    kind: type
    at: 'libs/ui-components/src/button/Button.tsx:L12-L12'
  - symbol: HTMLButtonType
    kind: type
    at: 'libs/ui-components/src/button/Button.tsx:L13-L13'
  - symbol: ButtonProps
    kind: interface
    at: 'libs/ui-components/src/button/Button.tsx:L15-L38'
  - symbol: ChildProps
    kind: type
    at: 'libs/ui-components/src/button/Button.tsx:L40-L40'
  - symbol: renderAsChild
    kind: function
    at: 'libs/ui-components/src/button/Button.tsx:L42-L59'
  - symbol: Button
    kind: function
    at: 'libs/ui-components/src/button/Button.tsx:L61-L126'
  - symbol: renderContent
    kind: function
    at: 'libs/ui-components/src/button/Button.tsx:L89-L94'
  - symbol: CardProps
    kind: interface
    at: 'libs/ui-components/src/card/Card.tsx:L6-L13'
  - symbol: Card
    kind: function
    at: 'libs/ui-components/src/card/Card.tsx:L15-L54'
  - symbol: CarouselProps
    kind: interface
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L11-L20'
  - symbol: Carousel
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L22-L125'
  - symbol: update
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L42-L43'
  - symbol: onPointerDown
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L59-L63'
  - symbol: onPointerMove
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L65-L77'
  - symbol: onPointerEnd
    kind: function
    at: 'libs/ui-components/src/carousel/Carousel.tsx:L79-L82'
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
  - symbol: Footer
    kind: function
    at: 'libs/ui-components/src/footer/footer.tsx:L5-L115'
  - symbol: IconButtonType
    kind: type
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L15-L23'
  - symbol: IconButtonSize
    kind: type
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L24-L24'
  - symbol: IconButtonProps
    kind: interface
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L26-L43'
  - symbol: IconButtonComponent
    kind: function
    at: 'libs/ui-components/src/icon-button/IconButton.tsx:L50-L115'
  - symbol: IconComponent
    kind: type
    at: 'libs/ui-components/src/icon/Icon.tsx:L14-L14'
  - symbol: getIconComponent
    kind: function
    at: 'libs/ui-components/src/icon/Icon.tsx:L22-L24'
  - symbol: IconProps
    kind: interface
    at: 'libs/ui-components/src/icon/Icon.tsx:L26-L34'
  - symbol: Icon
    kind: function
    at: 'libs/ui-components/src/icon/Icon.tsx:L38-L57'
  - symbol: IconType
    kind: type
    at: 'libs/ui-components/src/icon/icon.config.ts:L158-L158'
---

<!-- context:generated:start -->

## Summary

Comprehensive collection of reusable React components for Global Fishing Watch applications, spanning basic primitives (Button, Icon, IconButton) to complex interactive widgets (Carousel, Choice, ColorBar, Header). Components emphasize accessibility, CSS module encapsulation, and composition patterns like asChild for router integration and render-as-child delegation.

## Related

- depends on [[color-theme-configuration]] — Components rely on color-bar options and CSS custom properties for theming; ColorBar and IconButton read --color-danger-red at runtime for dynamic styling
- depends on [[icon-system]] — Icon, IconButton, Button, and other components consume IconType from icon.config for type-safe icon selection and dynamic SVG loading

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
