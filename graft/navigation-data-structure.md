---
name: Navigation Data Structure
slug: navigation-data-structure
type: concept
sources:
  - path: libs/ui-components/src/header/Header.tsx
    hash: a6854be6ae5054e604a1fc87fbd33e79eb41ab76ef46a6c53ece3d4b17051199
  - path: libs/ui-components/src/html-header/Header.links.ts
    hash: 44ec2056073c1fa5b57c4a168f88269770abe28f5203f4ff2b343e37020909dc
  - path: libs/ui-components/src/html-header/Header.tsx
    hash: 24083d98bddcb51e34b07603f41511a70b71d29b5b52319d3dec53bd381d14b4
sources_digest: 0f56f760b28ae8bce8196052eb57a634cbced1539dc4cefa729ecf20203a0294
links:
  - to: header-navigation-system
    relation: implements
    description: >-
      MenuItem type and navigation array are implemented by Header.links and
      consumed by Header.tsx and html/Header.tsx for recursive menu rendering
generator:
  version: 1
covers:
  - symbol: MenuItem
    kind: type
    at: 'libs/ui-components/src/header/Header.tsx:L149-L157'
  - symbol: HeaderProps
    kind: interface
    at: 'libs/ui-components/src/header/Header.tsx:L159-L168'
  - symbol: HeaderMenuItemProps
    kind: interface
    at: 'libs/ui-components/src/header/Header.tsx:L169-L172'
  - symbol: HeaderMenuItem
    kind: function
    at: 'libs/ui-components/src/header/Header.tsx:L174-L221'
  - symbol: getUserMenuItem
    kind: function
    at: 'libs/ui-components/src/header/Header.tsx:L223-L261'
  - symbol: Header
    kind: function
    at: 'libs/ui-components/src/header/Header.tsx:L263-L323'
  - symbol: MenuItem
    kind: type
    at: 'libs/ui-components/src/html-header/Header.links.ts:L3-L10'
  - symbol: HeaderProps
    kind: interface
    at: 'libs/ui-components/src/html-header/Header.tsx:L9-L13'
  - symbol: HeaderMenuItemProps
    kind: interface
    at: 'libs/ui-components/src/html-header/Header.tsx:L14-L18'
  - symbol: HeaderMenuItem
    kind: function
    at: 'libs/ui-components/src/html-header/Header.tsx:L20-L49'
  - symbol: Header
    kind: function
    at: 'libs/ui-components/src/html-header/Header.tsx:L51-L86'
---

<!-- context:generated:start -->

## Summary

Hierarchical MenuItem type defining tree nodes with label, optional link, nested children, styling hints (mini property), and click handlers. Consumed by both React Header.tsx and static html/Header.tsx components to render dropdown menus and filter navigation visibility based on viewport (mini flag collapses submenus on small screens). The navigation array is the single source of truth for site information architecture—updates must propagate across all header variants.

## Related

- implements [[header-navigation-system]] — MenuItem type and navigation array are implemented by Header.links and consumed by Header.tsx and html/Header.tsx for recursive menu rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
