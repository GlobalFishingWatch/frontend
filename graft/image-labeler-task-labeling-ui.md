---
name: Image Labeler task labeling UI
slug: image-labeler-task-labeling-ui
type: system
sources:
  - path: apps/image-labeler/src/features/project/LevelsSlider.tsx
    hash: bc30041b490c70b66c256aec5bafe9f9972f3b5559ca8edae4381962c0debef2
  - path: apps/image-labeler/src/features/project/Project.tsx
    hash: 1f40dff8849ae45b307d096b743e972765c0d9f2a092460bc42d34a777f86965
  - path: apps/image-labeler/src/features/project/Task.tsx
    hash: 1d397157ba9fd3926900a3051de3152255509896a2d6b70ce8a9233bb3f52ade
  - path: apps/image-labeler/src/features/project/TaskImage.tsx
    hash: c2622a6e9c098185f9a1cce86bf63a06759a2e42664d624f6e78760b6d3fc09e
sources_digest: 7f1a71a9c919e61ac410d20a786993c26c638b22d2c8ac6448756a44142f764b
links:
  - to: image-labeler-redux-api-layer
    relation: uses
    description: >-
      Project uses projectApi queries to fetch tasks; Task uses taskApi mutation
      to persist label selections
  - to: image-processing-and-visualization-utilities
    relation: uses
    description: >-
      TaskImage and LevelsSlider depend on TaskImage.utils for image decoding,
      histogram computation, levels application, and canvas rendering
generator:
  version: 1
covers:
  - symbol: LevelsSlider
    kind: function
    at: 'apps/image-labeler/src/features/project/LevelsSlider.tsx:L13-L78'
  - symbol: handleChange
    kind: function
    at: 'apps/image-labeler/src/features/project/LevelsSlider.tsx:L26-L28'
  - symbol: Project
    kind: function
    at: 'apps/image-labeler/src/features/project/Project.tsx:L21-L169'
  - symbol: TaskProps
    kind: type
    at: 'apps/image-labeler/src/features/project/Task.tsx:L14-L24'
  - symbol: Task
    kind: function
    at: 'apps/image-labeler/src/features/project/Task.tsx:L26-L169'
  - symbol: handleKeyDown
    kind: function
    at: 'apps/image-labeler/src/features/project/Task.tsx:L62-L72'
  - symbol: TaskImageProps
    kind: type
    at: 'apps/image-labeler/src/features/project/TaskImage.tsx:L14-L21'
  - symbol: TaskImage
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.tsx:L25-L181'
  - symbol: draw
    kind: function
    at: 'apps/image-labeler/src/features/project/TaskImage.tsx:L80-L103'
---

<!-- context:generated:start -->

## Summary

Core image annotation workflow component hierarchy. Project component fetches tasks via two API endpoints (paginated list and active task detail), merges results using uniqBy, and renders Task items with display mode controls (rangeMode, normMode, showCrosshair). Task component presents individual labeling decisions with image viewer, keyboard shortcuts (1–9 for quick selection, Escape to skip), and metadata rendering including Google Maps links for georeferenced locations. Task manages open/closed state for summary vs. controls view and submits labels via useSetTaskMutation. TaskImage renders canvas-based image display with interactive histogram-based levels adjustment via LevelsSlider. Route state persists activeTaskId as search parameter for reload preservation.

## Related

- uses [[image-labeler-redux-api-layer]] — Project uses projectApi queries to fetch tasks; Task uses taskApi mutation to persist label selections
- uses [[image-processing-and-visualization-utilities]] — TaskImage and LevelsSlider depend on TaskImage.utils for image decoding, histogram computation, levels application, and canvas rendering

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
