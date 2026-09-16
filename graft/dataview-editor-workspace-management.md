---
name: Dataview Editor & Workspace Management
slug: dataview-editor-workspace-management
type: system
sources:
  - path: apps/platform/features/_map/editor/DataviewEditor.tsx
    hash: 3a52e8aa50f7bf3b92a7cdd5ee98fee3c5044b45eb0cfb39dd0c5317858da50b
  - path: apps/platform/features/_map/editor/editor.slice.ts
    hash: c3796a208894fe44c02cfaaa836dd0fcc7222025f01ab946d357ba3dfd205836
  - path: apps/platform/features/_map/editor/EditorMenu.tsx
    hash: 805a61e2c8315865ae669947e63b220421343dfdce64a4e439f8849932456da8
  - path: apps/platform/features/_map/editor/WorkspaceEditor.tsx
    hash: 82ea405c8d98bde5cc1e0efb16c2e911ab9dddf2fb23e0cf3cf3eb7c747503a1
sources_digest: f784752f9d55ac32831ec666a327cf3bc87954d0ea5fd447f4a5119d4cd004e3
links:
  - to: dataview-type-category-selectors
    relation: depends_on
    description: >-
      DataviewEditor uses DATASET_CATEGORY_BY_DATAVIEW_CATEGORY and category
      enums to filter dataset options.
generator:
  version: 1
covers:
  - symbol: getDatasetCategory
    kind: function
    at: 'apps/platform/features/_map/editor/DataviewEditor.tsx:L57-L58'
  - symbol: temporalResolutionOption
    kind: type
    at: 'apps/platform/features/_map/editor/DataviewEditor.tsx:L64-L64'
  - symbol: DataviewEditorProps
    kind: type
    at: 'apps/platform/features/_map/editor/DataviewEditor.tsx:L71-L74'
  - symbol: DataviewEditor
    kind: function
    at: 'apps/platform/features/_map/editor/DataviewEditor.tsx:L76-L369'
  - symbol: onDataviewPropertyChange
    kind: function
    at: 'apps/platform/features/_map/editor/DataviewEditor.tsx:L113-L115'
  - symbol: onDataviewConfigChange
    kind: function
    at: 'apps/platform/features/_map/editor/DataviewEditor.tsx:L117-L122'
  - symbol: onSaveClick
    kind: function
    at: 'apps/platform/features/_map/editor/DataviewEditor.tsx:L124-L184'
  - symbol: Section
    kind: type
    at: 'apps/platform/features/_map/editor/EditorMenu.tsx:L16-L16'
  - symbol: EditorMenu
    kind: function
    at: 'apps/platform/features/_map/editor/EditorMenu.tsx:L17-L52'
  - symbol: onEditClick
    kind: function
    at: 'apps/platform/features/_map/editor/EditorMenu.tsx:L23-L26'
  - symbol: onCancelClick
    kind: function
    at: 'apps/platform/features/_map/editor/EditorMenu.tsx:L28-L31'
  - symbol: WorkspaceEditorProps
    kind: type
    at: 'apps/platform/features/_map/editor/WorkspaceEditor.tsx:L28-L30'
  - symbol: WorkspaceEditor
    kind: function
    at: 'apps/platform/features/_map/editor/WorkspaceEditor.tsx:L32-L150'
  - symbol: isDataviewAdded
    kind: function
    at: 'apps/platform/features/_map/editor/WorkspaceEditor.tsx:L62-L66'
  - symbol: addDataviewToWorkspace
    kind: function
    at: 'apps/platform/features/_map/editor/WorkspaceEditor.tsx:L68-L81'
  - symbol: onDataviewClick
    kind: function
    at: 'apps/platform/features/_map/editor/WorkspaceEditor.tsx:L83-L97'
  - symbol: EditorState
    kind: interface
    at: 'apps/platform/features/_map/editor/editor.slice.ts:L24-L29'
  - symbol: fetchDataviewsBy
    kind: function
    at: 'apps/platform/features/_map/editor/editor.slice.ts:L46-L55'
  - symbol: LazyLoadedSlices
    kind: interface
    at: 'apps/platform/features/_map/editor/editor.slice.ts:L113-L113'
---

<!-- context:generated:start -->

## Summary

The editor system (EditorMenu, DataviewEditor, WorkspaceEditor) provides UI for creating/editing dataviews and managing workspace-level dataview configurations. DataviewEditor validates form state for name, category, color, datasets, and category-specific settings (breaks for Environment, temporal resolution for heatmaps). WorkspaceEditor fetches available dataviews via fetchEditorDataviewsThunk (deduplicates by slug/ID, filters templates), displays them categorized, and uses useDataviewInstancesConnect to add/remove instances. EditorMenu gates access via selectHasDataviewEditPermissions and coordinates navigation between views.

## Related

- depends on [[dataview-type-category-selectors]] — DataviewEditor uses DATASET_CATEGORY_BY_DATAVIEW_CATEGORY and category enums to filter dataset options.

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
