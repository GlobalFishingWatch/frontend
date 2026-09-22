---
name: Switch control system
slug: switch-control-system
type: system
sources:
  - path: libs/ui-components/src/switch-row/index.ts
    hash: 8e4761c5b55ac4cf113d3aadf21c2da5c66062507a43f2e7d50157f8f8ff3aea
  - path: libs/ui-components/src/switch-row/SwitchRow.tsx
    hash: 3ba248abd290ba837b46a87f57c035b3a27e903e12282c2ccc190964bbde2614
  - path: libs/ui-components/src/switch/index.ts
    hash: 1ec2db5140263f61990f7c452c9220615d0e682ffd5a5885162aa9288750da55
  - path: libs/ui-components/src/switch/Switch.tsx
    hash: 0988af810a1785ab44c6f8fb49ed47bb7b7efabdefe7e3392699b85b5b82691c
sources_digest: 18cdfa47ff65a2ad02bae130026322d900f122f468dfc1652abf1638c18a7d78
links: []
generator:
  version: 1
covers:
  - symbol: SwitchRowProps
    kind: type
    at: 'libs/ui-components/src/switch-row/SwitchRow.tsx:L11-L14'
  - symbol: SwitchRow
    kind: function
    at: 'libs/ui-components/src/switch-row/SwitchRow.tsx:L16-L31'
  - symbol: SwitchEvent
    kind: interface
    at: 'libs/ui-components/src/switch/Switch.tsx:L12-L14'
  - symbol: SwitchSize
    kind: type
    at: 'libs/ui-components/src/switch/Switch.tsx:L16-L16'
  - symbol: SwitchProps
    kind: interface
    at: 'libs/ui-components/src/switch/Switch.tsx:L18-L29'
  - symbol: Switch
    kind: function
    at: 'libs/ui-components/src/switch/Switch.tsx:L31-L76'
  - symbol: onClickCallback
    kind: function
    at: 'libs/ui-components/src/switch/Switch.tsx:L45-L52'
---

<!-- context:generated:start -->

## Summary

Accessible toggle button controls with tooltip support and size variants. Switch.tsx exports SwitchProps and SwitchEvent, wrapping a semantic button with role="switch" and aria-checked for a11y compliance. SwitchRow wraps Switch with a clickable label (role="button" with a11y linter disable), enabling larger interactive area but compromising accessibility. Both components export through index barrels.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
