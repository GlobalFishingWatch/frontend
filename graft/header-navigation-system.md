---
name: Header & Navigation System
slug: header-navigation-system
type: system
sources:
  - path: libs/ui-components/src/header/Header.tsx
    hash: a6854be6ae5054e604a1fc87fbd33e79eb41ab76ef46a6c53ece3d4b17051199
  - path: libs/ui-components/src/header/index.ts
    hash: ef467ce6910c79dddc2d20abfa81b0a122b6d381899fa3ca97ece455b629c785
  - path: libs/ui-components/src/html-header/Header.links.ts
    hash: 44ec2056073c1fa5b57c4a168f88269770abe28f5203f4ff2b343e37020909dc
  - path: libs/ui-components/src/html-header/Header.tsx
    hash: 24083d98bddcb51e34b07603f41511a70b71d29b5b52319d3dec53bd381d14b4
  - path: libs/ui-components/src/html-header/html/Header.tsx
    hash: 5af4bd12694a1ed85beb8834e0271cca63f714f213f0a92f2bfc1a3da9bc6e86
  - path: libs/ui-components/src/html-header/index.ts
    hash: ef467ce6910c79dddc2d20abfa81b0a122b6d381899fa3ca97ece455b629c785
  - path: libs/ui-components/src/html-header/render-html.tsx
    hash: 6f2d02b32413756cbb3db07ddf17ba7b1976df316519f06c57d870126194639c
sources_digest: e27cd09ba0680e9b52d8653c79703817f27e0d11bfe9b5daf6b61a3c76fc6283
links:
  - to: button-interactive-controls
    relation: uses
    description: >-
      Header integrates Button and IconButton for navigation links and user
      account controls
  - to: navigation-data-structure
    relation: implements
    description: >-
      Header.tsx and html/Header.tsx consume MenuItem type and navigation array
      from Header.links; render recursive dropdown submenus with accordion
      checkboxes for mobile
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
  - symbol: HeaderProps
    kind: interface
    at: 'libs/ui-components/src/html-header/html/Header.tsx:L5-L8'
  - symbol: Header
    kind: function
    at: 'libs/ui-components/src/html-header/html/Header.tsx:L10-L67'
  - symbol: ComponentItem
    kind: type
    at: 'libs/ui-components/src/html-header/render-html.tsx:L14-L17'
  - symbol: preRender
    kind: function
    at: 'libs/ui-components/src/html-header/render-html.tsx:L34-L48'
---

<!-- context:generated:start -->

## Summary

Site-wide navigation and branding components spanning React header (Header.tsx with user auth, dropdown menus) and static HTML header variants pre-rendered for non-React consumption. Header accepts hierarchical MenuItem structures (defined in Header.links) for flexible multi-level menus, supports mobile responsiveness via checkbox-based accordion pattern, and conditionally renders mini/inverted styling variants.

## Related

- uses [[button-interactive-controls]] — Header integrates Button and IconButton for navigation links and user account controls
- implements [[navigation-data-structure]] — Header.tsx and html/Header.tsx consume MenuItem type and navigation array from Header.links; render recursive dropdown submenus with accordion checkboxes for mobile

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
