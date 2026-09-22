# apps/platform/features/_map/workspace/workspace.hook.ts · [[workspace-dataview-instance-management]]

Provides React hooks and utilities for managing dataview instances (layers) in the workspace map, including adding, updating, removing, and deleting layers with automatic color cycling.

- createDataviewsInstances · function · L18-L46 — Assigns the next available color to new dataview instances based on color cycling configuration and already-used colors.
- mergeDataviewIntancesToUpsert · function · L48-L81 — Merges new dataview instances with existing ones, either updating matches by id or creating new instances with assigned colors.
- useDataviewInstancesConnect · function · L83-L162 — Provides a hook exposing callbacks to add, update, remove, and delete dataview instances while syncing changes to the URL query parameters.
