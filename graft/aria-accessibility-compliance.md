---
name: ARIA accessibility compliance
slug: aria-accessibility-compliance
type: concept
sources:
  - path: libs/ui-components/src/switch-row/SwitchRow.tsx
    hash: 3ba248abd290ba837b46a87f57c035b3a27e903e12282c2ccc190964bbde2614
  - path: libs/ui-components/src/switch/Switch.tsx
    hash: 0988af810a1785ab44c6f8fb49ed47bb7b7efabdefe7e3392699b85b5b82691c
  - path: libs/ui-components/src/tabs/Tabs.tsx
    hash: 64fb20f0af069cd0d21dff3ecba2e95fe4f4c7ff945c2deb50b0889c2e9b932e
  - path: libs/ui-components/src/tag/Tag.tsx
    hash: e03c2c98e60af419b5076735dbfbbf06fbaaf42b7248a9b3f882a8c86808a322
  - path: libs/ui-components/src/tooltip/Tooltip.tsx
    hash: edeb35f864b6b0e95d87bee9a80e1e2377246b6a588852b15a1d7e2664aa844a
sources_digest: c649bdc0b9985e04a934f0538965c0e8d7581d9b3e18096fb142e28ae8b9ec48
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
  - symbol: TabsProps
    kind: interface
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L11-L20'
  - symbol: Tabs
    kind: function
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L22-L118'
  - symbol: handleTabClick
    kind: function
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L41-L52'
  - symbol: TagProps
    kind: interface
    at: 'libs/ui-components/src/tag/Tag.tsx:L11-L19'
  - symbol: Tag
    kind: function
    at: 'libs/ui-components/src/tag/Tag.tsx:L21-L53'
  - symbol: TooltipPlacement
    kind: type
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L19-L19'
  - symbol: TooltipProps
    kind: type
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L21-L26'
  - symbol: TooltipComponent
    kind: function
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L31-L97'
  - symbol: Tooltip
    kind: function
    at: 'libs/ui-components/src/tooltip/Tooltip.tsx:L99-L109'
---

<!-- context:generated:start -->

## Summary

Components implement semantic HTML and ARIA attributes to ensure screen reader and keyboard navigation support: Switch uses role="switch" and aria-checked; Tabs renders role="tablist", role="tab", role="tabpanel" with aria-selected/aria-expanded/aria-controls; Tooltip wraps string children in span with role="button"; various components conditionally set aria-label. Notable exception: SwitchRow disables jsx-a11y/no-noninteractive-element-interactions linter for pragmatic but non-compliant label clickability, representing a documented accessibility compromise.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
