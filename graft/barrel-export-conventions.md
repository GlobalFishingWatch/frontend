---
name: Barrel Export Conventions
slug: barrel-export-conventions
type: concept
sources:
  - path: libs/ui-components/src/button/index.ts
    hash: 09cba733866a92cbb2bff3b5551f4b5a8f88827c1d682814b63f5d22eedf3ba0
  - path: libs/ui-components/src/card/index.ts
    hash: 154b99d2f0fc91eae9e8be599f1084dd1cb2d80b56b790289b412c4c92a74c5a
  - path: libs/ui-components/src/carousel/index.ts
    hash: c833c344de8778c5cf297026de2091733a1b729f629de8b12509ff978be4e4f1
  - path: libs/ui-components/src/checkbox/index.ts
    hash: 4e6666daa89d0c40168357588371345eb15163042c5fa1f00a947d6b2e420bcc
  - path: libs/ui-components/src/choice/index.ts
    hash: 2d81dd1e9d0ea0b6c37d64d13040342368231f7069f552349293b28b799a10a2
  - path: libs/ui-components/src/collapsable/index.ts
    hash: 4b67361a569fd0c3f12bd012f1871b8d640f73f5939fbe188d7072ecd615c3f2
  - path: libs/ui-components/src/color-bar/index.ts
    hash: 7f23772dec063ef26ad1edfebb9f1c0f9de4244aeb67789d1e614ff9e41bac3b
  - path: libs/ui-components/src/download-survey/index.ts
    hash: 2ccee1f60cd40688211fca81997c5568f76b5b3e7ea84a5c4dbc617d1c24044f
  - path: libs/ui-components/src/footer/index.ts
    hash: a8fab1138439553ac53c874609e506c7f1c6a2893a472e5b711fc41ba8a52913
  - path: libs/ui-components/src/header/index.ts
    hash: ef467ce6910c79dddc2d20abfa81b0a122b6d381899fa3ca97ece455b629c785
  - path: libs/ui-components/src/html-header/index.ts
    hash: ef467ce6910c79dddc2d20abfa81b0a122b6d381899fa3ca97ece455b629c785
  - path: libs/ui-components/src/icon-button/index.ts
    hash: 5a49529ec26565405080679e5966fa60dbf564a6daf42c55cb8fad8e21f16dce
sources_digest: e9af6c1d08d82dba3e1d63f0784a84f0899eab974146799ab72c4813a69102af
links:
  - to: ui-components-library
    relation: implements
    description: >-
      All ui-component modules follow barrel export pattern for consistent
      public API
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Standard pattern where each component directory contains an index.ts that re-exports all public symbols from the component file(s). This enables clean import paths (e.g., from 'libs/ui-components/button' instead of 'libs/ui-components/button/Button.tsx') and centralizes public API decisions. The pattern is consistent across all ui-components modules and allows internal file reorganization without breaking external dependencies.

## Related

- implements [[ui-components-library]] — All ui-component modules follow barrel export pattern for consistent public API

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
