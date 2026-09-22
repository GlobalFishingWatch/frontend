---
name: Dataset Error and Status Display Components
slug: dataset-error-and-status-display-components
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/DatasetLoginRequired.tsx
    hash: c518f19798ba11a835ebe7aab25eb4c102a3e9d40865c64a5f9fd623bde81630
  - path: apps/platform/features/_map/workspace/shared/DatasetNotFound.tsx
    hash: 3b921ee0341b4e9af18018a5ffa68d90f65843c0ee1331cc197d0d4e695ea6f2
  - path: apps/platform/features/_map/workspace/shared/InfoButton.tsx
    hash: 1dd4b7bbac0a3992426bca9964f46666a29418aecbba59468fa389c581df4dfd
  - path: apps/platform/features/_map/workspace/shared/InfoError.tsx
    hash: 62130fb44c8be8d9bc923edb9278e89376e44f329ea484423f5a89e4fce823a4
sources_digest: e0b913a3c3394da154d63d9ea9001081811123eee682f97b2bb8cf45ad17980a
links:
  - to: layer-panel-container-and-layout-components
    relation: part_of
    description: >-
      These error/status components render as child elements within layer
      panels, providing inline feedback without disrupting overall panel
      structure
generator:
  version: 1
covers:
  - symbol: DatasetLoginRequired
    kind: function
    at: >-
      apps/platform/features/_map/workspace/shared/DatasetLoginRequired.tsx:L11-L46
  - symbol: DatasetNotFound
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/DatasetNotFound.tsx:L14-L34'
  - symbol: InfoButtonProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/InfoButton.tsx:L10-L16'
  - symbol: InfoButton
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/InfoButton.tsx:L18-L63'
  - symbol: InfoErrorProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/InfoError.tsx:L4-L11'
  - symbol: InfoError
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/InfoError.tsx:L13-L33'
---

<!-- context:generated:start -->

## Summary

Renders error states and status indicators for datasets within layer panels, including login requirements, dataset-not-found errors, import progress, and informational alerts. Components integrate with Redux user state selectors and side panel navigation to offer contextual actions (login button, dataset info panel, error details).

## Related

- part of [[layer-panel-container-and-layout-components]] — These error/status components render as child elements within layer panels, providing inline feedback without disrupting overall panel structure

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
