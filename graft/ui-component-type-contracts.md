---
name: UI component type contracts
slug: ui-component-type-contracts
type: file
sources:
  - path: libs/ui-components/src/types.d.ts
    hash: b4d7a1a96cb6f219475244e6292122f051e1ab537c9dbcb0ddec6988139eea72
  - path: libs/ui-components/src/types/types.ts
    hash: e9298d965a6ba9d61c4ab1ae8d0e81bf63dc01466c196b0d4b2b639877a1c208
sources_digest: 3bda8e2844ffc090293908642ef0b3084a92c846f6b453b3a7bad403fb7996cb
links: []
generator:
  version: 1
covers:
  - symbol: ClassNames
    kind: interface
    at: 'libs/ui-components/src/types.d.ts:L13-L15'
  - symbol: TooltipTypes
    kind: type
    at: 'libs/ui-components/src/types/types.ts:L1-L11'
---

<!-- context:generated:start -->

## Summary

TypeScript type definitions for the UI components library. types.ts exports TooltipTypes, a broad union of valid tooltip content (ReactNode, ReactElement, string, number, collections, objects, null/undefined) that serves as a contract for tooltip content validation. types.d.ts declares module types for asset imports (if-emoji, SVG files as React components + URLs, CSS modules as typed objects) following webpack/CRA conventions.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
