---
name: Tag system
slug: tag-system
type: system
sources:
  - path: libs/ui-components/src/tag-list/index.ts
    hash: 959e6cda0b9b377de5b6b41f7c7866b703d160c2ef97ffbd80554dc6ab5b5181
  - path: libs/ui-components/src/tag-list/TagList.tsx
    hash: e74d464970e942ff9cef4d5106514551d09613190a7c3062b74fd0b6414b4c36
  - path: libs/ui-components/src/tag/index.ts
    hash: e0542a8cdd49d6f4b54aca477f7948e5a7053d9ed967f7524035f96532fdf453
  - path: libs/ui-components/src/tag/Tag.tsx
    hash: e03c2c98e60af419b5076735dbfbbf06fbaaf42b7248a9b3f882a8c86808a322
sources_digest: 3809e2537a6e516c551380193b9e4b9ec6925ed398985a91241abf230ff913af
links: []
generator:
  version: 1
covers:
  - symbol: TagListProps
    kind: interface
    at: 'libs/ui-components/src/tag-list/TagList.tsx:L10-L16'
  - symbol: TagList
    kind: function
    at: 'libs/ui-components/src/tag-list/TagList.tsx:L18-L47'
  - symbol: TagItem
    kind: type
    at: 'libs/ui-components/src/tag-list/index.ts:L6-L12'
  - symbol: TagListOnRemove
    kind: type
    at: 'libs/ui-components/src/tag-list/index.ts:L18-L18'
  - symbol: TagProps
    kind: interface
    at: 'libs/ui-components/src/tag/Tag.tsx:L11-L19'
  - symbol: Tag
    kind: function
    at: 'libs/ui-components/src/tag/Tag.tsx:L21-L53'
---

<!-- context:generated:start -->

## Summary

Displays and manages removable tags in lists. Tag.tsx is a low-level element supporting optional close button (via IconButton), tooltip, and custom color; renders only when onRemove is provided. TagList.tsx wraps Tag in a list container with per-tag interactivity control and dual rendering pattern (inline Tag display plus expanded tooltip div with sourceExpanded class), supporting mixed interactive and static tags. TagItem type defines tag shape with id, label, optional tooltip config, and interactive flag. Both export through index barrels.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
