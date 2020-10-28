import React, { Suspense, lazy, useCallback, useMemo } from 'react'
import { ModalConfigOptions, ModalTypes } from 'types'
import GFWModal from '@globalfishingwatch/ui-components/dist/modal'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useCurrentWorkspaceConnect } from 'features/workspaces/workspaces.hook'
import { useDraftDataviewConnect } from 'features/dataviews/dataviews.hook'
import { useDraftDatasetConnect } from 'features/datasets/datasets.hook'
import { useModalConnect } from './modal.hooks'

const MODALS: ModalConfigOptions = {
  newWorkspace: {
    title: 'New Workspace',
    component: 'workspaces/NewWorkspace.tsx',
  },
  shareWorkspace: {
    title: 'Workspace sharing options',
    component: 'workspaces/ShareWorkspace.tsx',
  },
  newAOI: {
    title: 'New Area of Interest',
    component: 'areas-of-interest/NewAreaOfInterest.tsx',
  },
  newDataset: {
    title: 'New Dataset',
    component: 'datasets/NewDataset.tsx',
  },
  editDataset: {
    title: 'Edit Dataset',
    component: 'datasets/EditDataset.tsx',
  },
  newDataview: {
    title: 'Add Dataset',
    component: 'dataviews/NewDataview.tsx',
  },
}

const ModalComponent = (component: string) => {
  return lazy(() => import(`../${component}`))
}

function Modal(): React.ReactElement | null {
  const { modal, hideModal } = useModalConnect()
  const { workspace } = useCurrentWorkspaceConnect()
  const { draftDataview, resetDraftDataview } = useDraftDataviewConnect()
  const { draftDataset, dispatchResetDraftDataset } = useDraftDatasetConnect()

  const onCloseClick = useCallback(() => {
    if (draftDataview) {
      resetDraftDataview()
    }
    if (draftDataset) {
      dispatchResetDraftDataset()
    }
    hideModal()
  }, [dispatchResetDraftDataset, draftDataset, draftDataview, hideModal, resetDraftDataview])

  const selectedModal = MODALS[modal as ModalTypes]
  const ComponentModal = useMemo(
    () => (selectedModal ? ModalComponent(selectedModal.component) : null),
    [selectedModal]
  )

  if (!modal) return null

  const isUpdating =
    (workspace?.id && modal === 'newWorkspace') || (draftDataview?.id && modal === 'newDataview')
  const title = isUpdating
    ? selectedModal?.title.replace('New', 'Edit').replace('Add', 'Edit')
    : selectedModal?.title
  return selectedModal ? (
    <GFWModal title={title} isOpen onClose={onCloseClick}>
      <Suspense fallback={<Spinner />}>{ComponentModal && <ComponentModal />}</Suspense>
    </GFWModal>
  ) : null
}

export default Modal
