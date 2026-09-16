---
name: Image Labeler project management UI
slug: image-labeler-project-management-ui
type: system
sources:
  - path: apps/image-labeler/src/features/projects-list/ProjectForm.tsx
    hash: 4bb41267892e863158956fd192f6890a3bfcbb644008a666db84125442634b97
  - path: apps/image-labeler/src/features/projects-list/ProjectItem.tsx
    hash: fa79fb7d5bd79c7155f8cb3ec8539b42d516f4af314d3693318380c6cbaa35f2
  - path: apps/image-labeler/src/features/projects-list/ProjectsList.tsx
    hash: cb14b40288e27105cd3a8df8b807472d3480dd80c46d528b4a26e2728187cc97
sources_digest: 3d68cf260ad602550d84eb6d37c274e695f7eacea56554872faedab8f15b3af2
links:
  - to: image-labeler-redux-api-layer
    relation: uses
    description: >-
      Uses projectsListApi, projectCreateApi, and projectEditApi hooks to manage
      project lifecycle operations
  - to: image-labeler-task-labeling-ui
    relation: uses
    description: >-
      ProjectItem links to Project component via TanStack Router when user
      clicks project card
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

Feature-level components for creating, editing, and browsing labeling projects. ProjectsList serves as the authenticated landing page with Spinner-based loading and modal-driven project creation via EMPTY_PROJECT template. ProjectItem renders individual project cards with edit buttons that spawn ProjectForm modals. ProjectForm validates required fields (name, labels, bqQuery, bqTable), dispatches create/edit mutations, and triggers full page reload on success. Component depends on Global Fishing Watch UI library and integrates localStorage-based authentication checks via useGFWLogin and useGFWLoginRedirect.

## Related

- uses [[image-labeler-redux-api-layer]] — Uses projectsListApi, projectCreateApi, and projectEditApi hooks to manage project lifecycle operations
- uses [[image-labeler-task-labeling-ui]] — ProjectItem links to Project component via TanStack Router when user clicks project card

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
