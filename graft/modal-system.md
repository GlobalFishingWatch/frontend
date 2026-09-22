---
name: Modal System
slug: modal-system
type: system
sources:
  - path: apps/platform/features/modals/modals.selectors.ts
    hash: 33ca36bb72095b438c1ee8096e5737a6d74db60c83b1df1cd9fef96cd00c233d
  - path: apps/platform/features/modals/modals.slice.ts
    hash: 696b2ea0662bbf4839fad82a08e8b1fcc6d4a3d39dda000c0b8a918c632c7c69
  - path: apps/platform/features/modals/Modals.tsx
    hash: 528fd6055cb5ae66600fdb03926e4d345e74aa3af1bb84596c332fa143b21eb7
sources_digest: a10b3ea05de1dbae05d3153ca85efb218b3386100557b177e2d73486a2d97880
links:
  - to: secret-menu-pattern
    relation: uses
    description: >-
      Integrates useSecretMenu hooks to enable debug menu shortcuts (d/e/b keys)
      for GFW/JAC users
  - to: welcome-modal-content
    relation: depends_on
    description: >-
      Reads welcome content types and dispatches welcome modals based on
      workspace context
generator:
  version: 1
covers:
  - symbol: AppModals
    kind: function
    at: 'apps/platform/features/modals/Modals.tsx:L94-L289'
  - symbol: ModalId
    kind: type
    at: 'apps/platform/features/modals/modals.slice.ts:L8-L17'
  - symbol: BigQueryModalMode
    kind: type
    at: 'apps/platform/features/modals/modals.slice.ts:L27-L27'
  - symbol: LayerLibraryMode
    kind: type
    at: 'apps/platform/features/modals/modals.slice.ts:L29-L29'
  - symbol: DatasetUploadStyle
    kind: type
    at: 'apps/platform/features/modals/modals.slice.ts:L30-L30'
  - symbol: DatasetUploadConfig
    kind: type
    at: 'apps/platform/features/modals/modals.slice.ts:L31-L37'
  - symbol: ModalsOpenState
    kind: type
    at: 'apps/platform/features/modals/modals.slice.ts:L39-L54'
  - symbol: selectFeedbackModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L132-L132'
  - symbol: selectLayerLibraryModal
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L133-L133'
  - symbol: selectLayerLibraryModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L134-L135'
  - symbol: selectLayerLibraryUniqueCategory
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L136-L137'
  - symbol: selectDatasetUploadModalConfig
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L138-L138'
  - symbol: selectDatasetUploadModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L139-L139'
  - symbol: selectEditWorkspaceModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L140-L140'
  - symbol: selectCreateWorkspaceModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L141-L141'
  - symbol: selectScreenshotModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L142-L142'
  - symbol: selectVesselCorrectionModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L143-L143'
  - symbol: selectEditorMenuOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L144-L144'
  - symbol: selectDownloadTrackModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L145-L145'
  - symbol: selectOnboardingModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L146-L146'
  - symbol: selectBigQueryModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L147-L147'
  - symbol: selectTurningTidesModalOpen
    kind: function
    at: 'apps/platform/features/modals/modals.slice.ts:L148-L149'
---

<!-- context:generated:start -->

## Summary

Centralized orchestration and state management for 13+ modal dialogs (feedback, workspace creation, BigQuery, onboarding, etc.) rendered conditionally via Redux selectors. Implements secret keyboard shortcuts for debug/admin menus gated by user role, and manages welcome modal variants based on workspace context.

## Related

- uses [[secret-menu-pattern]] — Integrates useSecretMenu hooks to enable debug menu shortcuts (d/e/b keys) for GFW/JAC users
- depends on [[welcome-modal-content]] — Reads welcome content types and dispatches welcome modals based on workspace context

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
