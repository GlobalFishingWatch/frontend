---
name: Navigation Link Configuration
slug: navigation-link-configuration
type: concept
sources:
  - path: libs/ui-components/src/menu/Menu.constants.ts
    hash: cbd5a979d19bb99f96892fc3486c3bb5e5170e6e219a77bd0a9f2dc8147aa12e
  - path: libs/ui-components/src/menu/Menu.tsx
    hash: 2773bacff47c8d4271a4454442c413f1de523f3bbad545202b47359cd5161d94
sources_digest: 2a418a3e0c4c31d0b784bfe36b8fce25213725cf61cd3474d645d41d0f5d4044
links:
  - to: global-branding-navigation
    relation: implements
    description: >-
      Menu.constants defines MenuLink type and defaultLinks configuration for
      navigation
generator:
  version: 1
covers:
  - symbol: MenuLink
    kind: type
    at: 'libs/ui-components/src/menu/Menu.constants.ts:L1-L5'
  - symbol: MenuProps
    kind: interface
    at: 'libs/ui-components/src/menu/Menu.tsx:L12-L21'
  - symbol: Menu
    kind: function
    at: 'libs/ui-components/src/menu/Menu.tsx:L23-L68'
---

<!-- context:generated:start -->

## Summary

Menu.constants exports MenuLink type and a pre-populated defaultLinks array containing eight navigation entries pointing to major Global Fishing Watch website sections (Topics, Map & Data, Programs, Newsroom, About Us, Help, Terms of Use, Privacy Policy). The design centralizes navigation structure separately from rendering logic, allowing Menu components to use defaults or override with custom link arrays. A design constraint is that all links are external URLs (anchor tags), meaning navigation triggers full page reloads rather than internal routing—the activeLinkId prop relies on external coordination to track the current page for styling.

## Related

- implements [[global-branding-navigation]] — Menu.constants defines MenuLink type and defaultLinks configuration for navigation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
