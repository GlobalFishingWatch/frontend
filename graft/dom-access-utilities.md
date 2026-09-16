---
name: DOM Access Utilities
slug: dom-access-utilities
type: system
sources:
  - path: apps/platform/hooks/dom.hooks.ts
    hash: 84808c07800cd097340a01f58cc6a3ffef61c7994715907c7f3494c2542ae371
  - path: apps/platform/hooks/use-clicked-outside.ts
    hash: 8d8ebdfad80b1c6a556de24413b3ebdf268597406f82587b61431e4920baaa42
sources_digest: 556bb3b9c1f4ee2cf85bac25eeaee06f45a4e871d4c3d459936823e0ff0c57ee
links:
  - to: layout-system
    relation: uses
    description: >-
      Layout components maintain SCROLL_CONTAINER_DOM_ID contract; useDOMElement
      retrieves this container for portal and modal positioning
generator:
  version: 1
covers:
  - symbol: useDOMElement
    kind: function
    at: 'apps/platform/hooks/dom.hooks.ts:L5-L13'
  - symbol: useClickedOutside
    kind: function
    at: 'apps/platform/hooks/use-clicked-outside.ts:L3-L39'
---

<!-- context:generated:start -->

## Summary

Provides safe DOM element access via useDOMElement hook (retrieves elements by ID with fallback to ROOT_DOM_ELEMENT), click-outside detection via useClickedOutside (tracks coordinates to filter drag operations from genuine clicks), and scroll container management for modal positioning.

## Related

- uses [[layout-system]] — Layout components maintain SCROLL_CONTAINER_DOM_ID contract; useDOMElement retrieves this container for portal and modal positioning

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
