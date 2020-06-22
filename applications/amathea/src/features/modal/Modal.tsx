import React, { useMemo, Suspense, lazy } from 'react'
import { useSelector } from 'react-redux'
import GFWModal from '@globalfishingwatch/ui-components/dist/modal'
import { selectModal } from 'routes/routes.selectors'
import { useModalConnect } from './modal.hooks'

function Modal(): React.ReactElement | null {
  const { hideModal } = useModalConnect()
  const modal = useSelector(selectModal)

  // const modals: { [query in ModalTypes]?: { title: string; component: string } } = {
  const modals: any = {
    newWorkspace: {
      title: 'New Workspace',
      component: 'workspaces/NewWorkspace.tsx',
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

  const ModalComponent = (component: string) => {
    return lazy(() => import(`../${component}`))
  }

  const ComponentModal = useMemo(() => {
    return modal ? ModalComponent(modals[modal].component) : undefined
  }, [modals, modal])

  return modal ? (
    <GFWModal header={modals[modal].title} isOpen={modal !== undefined} onClose={hideModal}>
      <Suspense fallback={null}>{ComponentModal && <ComponentModal />}</Suspense>
    </GFWModal>
  ) : null
}

export default Modal
