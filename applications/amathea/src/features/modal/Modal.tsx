import React, { useMemo, Suspense, lazy } from 'react'
import { useSelector } from 'react-redux'
import { ModalConfigOptions } from 'types'
import GFWModal from '@globalfishingwatch/ui-components/dist/modal'
import { selectModal } from 'routes/routes.selectors'
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
}

function Modal(): React.ReactElement | null {
  const { hideModal } = useModalConnect()
  const modal = useSelector(selectModal)
  const selectedModal = MODALS[modal]

  const ModalComponent = (component: string) => {
    return lazy(() => import(`../${component}`))
  }

  const ComponentModal = useMemo(() => {
    return selectedModal ? ModalComponent(selectedModal.component) : null
  }, [selectedModal])

  return selectedModal ? (
    <GFWModal header={selectedModal.title} isOpen onClose={hideModal}>
      <Suspense fallback={null}>{ComponentModal && <ComponentModal />}</Suspense>
    </GFWModal>
  ) : null
}

export default Modal
