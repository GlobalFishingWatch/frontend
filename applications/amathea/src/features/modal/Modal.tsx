import React, { Suspense, lazy } from 'react'
import { ModalConfigOptions } from 'types'
import GFWModal from '@globalfishingwatch/ui-components/dist/modal'
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

  if (!modal) return null

  const selectedModal = MODALS[modal]
  const ComponentModal = selectedModal ? ModalComponent(selectedModal.component) : null
  return selectedModal ? (
    <GFWModal header={selectedModal.title} isOpen onClose={hideModal}>
      <Suspense fallback={null}>{ComponentModal && <ComponentModal />}</Suspense>
    </GFWModal>
  ) : null
}

export default Modal
