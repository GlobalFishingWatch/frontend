---
name: Color & Theme Configuration
slug: color-theme-configuration
type: system
sources:
  - path: libs/ui-components/src/color-bar/color-bar-options.ts
    hash: 2b0db8076ff4e3f526b2e399f24b5f5e8ab19ff0f72de0012beb1c00fdb6e8bb
  - path: libs/ui-components/src/color-bar/ColorBar.tsx
    hash: 77f5428554b3376b068a5e0d14475875665d93a59d00a041810d9bb357fc6567
  - path: libs/ui-components/src/color-bar/index.ts
    hash: 7f23772dec063ef26ad1edfebb9f1c0f9de4244aeb67789d1e614ff9e41bac3b
sources_digest: 159c6aae49183d10a2aa910be547462d950c781fb7748c1d4037d1964151b637
links:
  - to: icon-system
    relation: uses
    description: >-
      ColorBar integrates IconButton for mode toggle; relies on Icon for UI
      chrome
generator:
  version: 1
covers:
  - symbol: ColorBarProps
    kind: interface
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L17-L25'
  - symbol: ColorBar
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L27-L113'
  - symbol: toggleColorMode
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L48-L50'
  - symbol: handleHueBarSelection
    kind: function
    at: 'libs/ui-components/src/color-bar/ColorBar.tsx:L52-L57'
  - symbol: ColorBarOption
    kind: type
    at: 'libs/ui-components/src/color-bar/color-bar-options.ts:L1-L7'
---

<!-- context:generated:start -->

## Summary

Centralized color palette and theming system for fill and line styling. Defines FillColorBarOptions and LineColorBarOptions with disabled state and tooltip support, plus ColorBar component that provides dual-mode color selection (swatch palette vs. hue slider) with persistent mode preference via localStorage.

## Related

- uses [[icon-system]] — ColorBar integrates IconButton for mode toggle; relies on Icon for UI chrome

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
