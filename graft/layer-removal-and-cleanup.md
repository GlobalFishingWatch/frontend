---
name: Layer Removal and Cleanup
slug: layer-removal-and-cleanup
type: system
sources:
  - path: apps/platform/features/_map/workspace/shared/Remove.tsx
    hash: 6c490bd6650cc8f46b0581dd805e761981a33cd24f25a2db0836607fe772aaaf
sources_digest: 3ef5453039a437d7ce3db20d4eb3810d284e16d0d248c2396550af4dd226f945
links:
  - to: workspace-dataview-instance-management
    relation: uses
    description: Calls deleteDataviewInstance to remove dataview from workspace and URL
generator:
  version: 1
covers:
  - symbol: RemoveProps
    kind: type
    at: 'apps/platform/features/_map/workspace/shared/Remove.tsx:L9-L15'
  - symbol: Remove
    kind: function
    at: 'apps/platform/features/_map/workspace/shared/Remove.tsx:L17-L46'
---

<!-- context:generated:start -->

## Summary

Remove component that renders a delete button for removing dataview instances from the workspace. Integrates with workspace state management via useDataviewInstancesConnect to call deleteDataviewInstance by ID, with optional onClick handler override for custom removal logic. Supports flexible styling and testing props.

## Related

- uses [[workspace-dataview-instance-management]] — Calls deleteDataviewInstance to remove dataview from workspace and URL

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
