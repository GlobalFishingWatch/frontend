---
name: Tab navigation
slug: tab-navigation
type: system
sources:
  - path: libs/ui-components/src/tabs/index.ts
    hash: 32942131271a296aba74f0c8d1c91dd80346ca073bb8675357f488c19e51b133
  - path: libs/ui-components/src/tabs/Tabs.tsx
    hash: 64fb20f0af069cd0d21dff3ecba2e95fe4f4c7ff945c2deb50b0889c2e9b932e
sources_digest: ecfda599719e8c69f92f0bb8f05099d6f4f66a39e58a1dd5d1e1d57450ab5104
links: []
generator:
  version: 1
covers:
  - symbol: TabsProps
    kind: interface
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L11-L20'
  - symbol: Tabs
    kind: function
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L22-L118'
  - symbol: handleTabClick
    kind: function
    at: 'libs/ui-components/src/tabs/Tabs.tsx:L41-L52'
  - symbol: Tab
    kind: interface
    at: 'libs/ui-components/src/tabs/index.ts:L5-L13'
---

<!-- context:generated:start -->

## Summary

Generic, accessible tabbed interface with lazy-load support. Tabs.tsx manages loaded tabs separately from active tab, supports mountAllTabsOnLoad for eager rendering, handles tab click callbacks, and renders semantic ARIA attributes (role="tablist", role="tab", aria-selected, aria-expanded). Tab interface (from index) defines tab shape: id, title, optional content/tooltip, disabled flag, and testing attributes. Renders tab headers via Button component and content panels with semantic roles.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
