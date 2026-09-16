---
name: Form-based CRUD workflows with modal encapsulation
slug: form-based-crud-workflows-with-modal-encapsulation
type: concept
sources:
  - path: apps/image-labeler/src/features/projects-list/ProjectForm.tsx
    hash: 4bb41267892e863158956fd192f6890a3bfcbb644008a666db84125442634b97
  - path: apps/image-labeler/src/features/projects-list/ProjectItem.tsx
    hash: fa79fb7d5bd79c7155f8cb3ec8539b42d516f4af314d3693318380c6cbaa35f2
  - path: apps/image-labeler/src/features/projects-list/ProjectsList.tsx
    hash: cb14b40288e27105cd3a8df8b807472d3480dd80c46d528b4a26e2728187cc97
sources_digest: 3d68cf260ad602550d84eb6d37c274e695f7eacea56554872faedab8f15b3af2
links: []
generator:
  version: 1
covers:
  - symbol: ProjectForm
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectForm.tsx:L11-L146'
  - symbol: handleChange
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectForm.tsx:L27-L29'
  - symbol: saveProject
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectForm.tsx:L31-L38'
  - symbol: ProjectItem
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectItem.tsx:L12-L49'
  - symbol: closeModal
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectItem.tsx:L15-L17'
  - symbol: ProjectsList
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectsList.tsx:L23-L56'
  - symbol: closeModal
    kind: function
    at: 'apps/image-labeler/src/features/projects-list/ProjectsList.tsx:L32-L34'
---

<!-- context:generated:start -->

## Summary

Consistent pattern for create/edit operations in image-labeler. ProjectForm component validates required fields (name, labels, bqQuery, bqTable), dispatches appropriate mutation (useCreateProjectMutation or useEditProjectMutation based on mode prop), and triggers full page reload on success. ProjectItem wraps form in Modal component spawned by IconButton click, enabling in-place editing without navigation. ProjectsList seeds modal form with EMPTY_PROJECT template for new projects. API errors are validated and displayed, but form relies on page reload rather than local state update for post-success navigation, suggesting potential inconsistency with client-side routing expectations.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
