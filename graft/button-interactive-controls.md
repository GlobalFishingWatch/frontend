---
name: Button & Interactive Controls
slug: button-interactive-controls
type: system
sources:
  - path: libs/ui-components/src/button/Button.tsx
    hash: ea97b2d3ad987c5747becd1e41c73dbd905898c403970f4cae0e2c48e7e53b9f
  - path: libs/ui-components/src/icon-button/IconButton.tsx
    hash: 632fe4c391aaaaf58f6d1fd5c614122f9c51aa979cb80a17e241d484900d404b
sources_digest: 8afcdfcea4a5195b0e3b49973aab3a566703889db3c8c07916f6e3ab7ac4d811
links:
  - to: icon-system
    relation: uses
    description: >-
      IconButton displays Icon or loading Spinner; Button optionally wraps Icon
      for iconography
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
---

<!-- context:generated:start -->

## Summary

Primary button abstraction and related control components (Button, IconButton) that support multiple render targets (native button, anchor, router Link via asChild pattern), loading states via Spinner integration, and comprehensive tooltip support. The asChild pattern enables button to wrap external router components without taking a dependency on specific routers.

## Related

- uses [[icon-system]] — IconButton displays Icon or loading Spinner; Button optionally wraps Icon for iconography

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
