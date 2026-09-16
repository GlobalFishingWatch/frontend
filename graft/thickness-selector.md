---
name: Thickness selector
slug: thickness-selector
type: system
sources:
  - path: libs/ui-components/src/thickness-selector/index.ts
    hash: 29adcd14700c54d1430907ed5be00023c48317a369c9aa29b8b81caaa3f5258d
  - path: libs/ui-components/src/thickness-selector/thickness-selector-options.ts
    hash: 34729f19518327c59300205bd31fa88d727eeeea56e4be92ddeb13a7892a7ca7
  - path: libs/ui-components/src/thickness-selector/ThicknessSelector.tsx
    hash: 406e8fb7a00e2544f74ac36dd1fb8c43c15d5bc6fd8391b0705b7c6c16988c11
sources_digest: b41201e7ca4b9b9d18062c685f33faa0b89057d996e8cf55c3f92293cd46c813
links: []
generator:
  version: 1
covers:
  - symbol: ThicknessSelectorProps
    kind: interface
    at: 'libs/ui-components/src/thickness-selector/ThicknessSelector.tsx:L8-L11'
  - symbol: ThicknessSelector
    kind: function
    at: 'libs/ui-components/src/thickness-selector/ThicknessSelector.tsx:L13-L31'
  - symbol: Thicknes
    kind: type
    at: >-
      libs/ui-components/src/thickness-selector/thickness-selector-options.ts:L1-L1
  - symbol: ThicknessSelectorOption
    kind: type
    at: >-
      libs/ui-components/src/thickness-selector/thickness-selector-options.ts:L2-L5
---

<!-- context:generated:start -->

## Summary

Visual control for selecting thickness levels (thin/medium/thick mapped to 1/3/5 units). ThicknessSelector.tsx renders THICKNESS_OPTIONS as clickable list items with height proportional to value (scaled by 3px/unit), fires onThicknessClick callback, and disables jsx-a11y/no-noninteractive-element-interactions for `<li>` elements used as buttons. thickness-selector-options.ts defines ThicknessSelectorOption type and THICKNESS_OPTIONS constant as single source of truth. Both export through index barrel.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
