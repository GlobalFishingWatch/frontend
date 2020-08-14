import React, { Suspense, lazy, useCallback } from 'react'
import { ModalConfigOptions } from 'types'
import GFWModal from '@globalfishingwatch/ui-components/dist/modal'
import { useCurrentWorkspaceConnect } from 'features/workspaces/workspaces.hook'
import { useDraftDataviewConnect } from 'features/dataviews/dataviews.hook'
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
  newDataview: {
    title: 'New Dataview',
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

  const onCloseClick = useCallback(() => {
    if (draftDataview?.id) {
      resetDraftDataview()
    }
    hideModal()
  }, [draftDataview, hideModal, resetDraftDataview])

  if (!modal) return null

  const selectedModal = MODALS[modal]
  const ComponentModal = selectedModal ? ModalComponent(selectedModal.component) : null
  const isUpdating =
    (workspace?.id && modal === 'newWorkspace') || (draftDataview?.id && modal === 'newDataview')
  const title = isUpdating ? selectedModal?.title.replace('New', 'Edit') : selectedModal?.title
  return selectedModal ? (
    <GFWModal header={title} isOpen onClose={onCloseClick}>
      <Suspense fallback={null}>{ComponentModal && <ComponentModal />}</Suspense>
    </GFWModal>
  ) : null
}

export default Modal
