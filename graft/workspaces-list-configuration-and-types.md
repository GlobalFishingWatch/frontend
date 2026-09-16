---
name: Workspaces list configuration and types
slug: workspaces-list-configuration-and-types
type: file
sources:
  - path: apps/platform/features/_map/workspaces-list/workspaces-list.config.ts
    hash: 3120842e2893efdba2137f8d77ebdbc287d7e28b10b634e9c4f7ec538be4dbb2
sources_digest: 13f16323563dab2dcce69d409a84dc501e54097319d2a9c0faed573573fcb4ce
links:
  - to: workspaces-list-management-redux-slice-selectors
    relation: implements
    description: >-
      Provides static configuration and types consumed by workspaces-list
      selectors and thunks
  - to: workspaces-list-ui-components
    relation: implements
    description: >-
      Supplies static workspace metadata for rendering workspace cards and
      filtering
generator:
  version: 1
covers:
  - symbol: HighlightedWorkspaceCategory
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.config.ts:L21-L21
  - symbol: HighlightedWorkspace
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.config.ts:L23-L37
  - symbol: HighlightedWorkspaces
    kind: type
    at: >-
      apps/platform/features/_map/workspaces-list/workspaces-list.config.ts:L39-L42
---

<!-- context:generated:start -->

## Summary

Static configuration exporting HighlightedWorkspace and HighlightedWorkspaces types, WORKSPACES_BY_CATEGORY mapping, and AVAILABLE_WORKSPACES_CATEGORIES list. Deliberately isolated to avoid pulling expensive selector dependencies into MainNav and global navigation components; depends only on type imports and static data modules in data/map/highlighted-workspaces/.

## Related

- implements [[workspaces-list-management-redux-slice-selectors]] — Provides static configuration and types consumed by workspaces-list selectors and thunks
- implements [[workspaces-list-ui-components]] — Supplies static workspace metadata for rendering workspace cards and filtering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
