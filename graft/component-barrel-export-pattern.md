---
name: Component barrel export pattern
slug: component-barrel-export-pattern
type: concept
sources:
  - path: libs/ui-components/src/solar-status/index.ts
    hash: e5179b5269bfad938361900611964b5a10e3f7617b5557ac4cd66d2adec75f8c
  - path: libs/ui-components/src/spinner/index.ts
    hash: ce75a0b6a21548e3c0c57278c11150a552e3200ac71c65db0c7c8a78a357763a
  - path: libs/ui-components/src/split-view/index.ts
    hash: ed5baa14ee8dc436dda8ceae508cd24ef15b2ccced410f00199b333bc06540d4
  - path: libs/ui-components/src/switch-row/index.ts
    hash: 8e4761c5b55ac4cf113d3aadf21c2da5c66062507a43f2e7d50157f8f8ff3aea
  - path: libs/ui-components/src/switch/index.ts
    hash: 1ec2db5140263f61990f7c452c9220615d0e682ffd5a5885162aa9288750da55
  - path: libs/ui-components/src/tabs/index.ts
    hash: 32942131271a296aba74f0c8d1c91dd80346ca073bb8675357f488c19e51b133
  - path: libs/ui-components/src/tag-list/index.ts
    hash: 959e6cda0b9b377de5b6b41f7c7866b703d160c2ef97ffbd80554dc6ab5b5181
  - path: libs/ui-components/src/tag/index.ts
    hash: e0542a8cdd49d6f4b54aca477f7948e5a7053d9ed967f7524035f96532fdf453
  - path: libs/ui-components/src/textarea/index.ts
    hash: 595120788083d5c8652348312cf92faeeb1dd9b8a012d794c14a5b428af2622d
  - path: libs/ui-components/src/thickness-selector/index.ts
    hash: 29adcd14700c54d1430907ed5be00023c48317a369c9aa29b8b81caaa3f5258d
  - path: libs/ui-components/src/tooltip/index.ts
    hash: 670ff4c3dc40a8d1429b01f5fcfb545bb61915a9754a84c22345fe78297adb6e
  - path: libs/ui-components/src/transmissions-timeline/index.ts
    hash: 197fd9b2ba7c9f27889486637c5cc09f9ca68c9809e4b99bcf9320dab9aea475
sources_digest: dfa496c8bd2e914717e78100e7692109655ced7f50f5da2a1f9e9f202bf11115
links: []
generator:
  version: 1
covers:
  - symbol: Tab
    kind: interface
    at: 'libs/ui-components/src/tabs/index.ts:L5-L13'
  - symbol: TagItem
    kind: type
    at: 'libs/ui-components/src/tag-list/index.ts:L6-L12'
  - symbol: TagListOnRemove
    kind: type
    at: 'libs/ui-components/src/tag-list/index.ts:L18-L18'
---

<!-- context:generated:start -->

## Summary

Universal design pattern across ui-components library: each component defines implementation in its primary module (e.g., Spinner.tsx, Switch.tsx) and exposes via sibling index.ts file using re-exports. Pattern decouples internal file structure from public API, enabling refactoring without breaking downstream consumers; simplifies import paths (from `libs/ui-components/src/switch` vs `libs/ui-components/src/switch/Switch.tsx`). Consistently applied across ~15+ component modules.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
