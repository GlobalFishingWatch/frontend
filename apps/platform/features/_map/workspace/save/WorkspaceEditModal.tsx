import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Modal } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/map/config'
import { selectWorkspaceWithCurrentState } from 'features/_map/workspace/selectors/app.workspace.selectors'
import type { AppWorkspace } from 'features/_map/workspaces-list/workspaces-list.slice'
import { getModalParent } from 'features/modals/modals.utils'

import { useSaveWorkspaceModalConnect } from './workspace-save.hooks'
import EditWorkspace from './WorkspaceEdit'

import styles from './WorkspaceSaveModal.module.css'

type EditWorkspaceModalProps = {
  title?: string
  onFinish?: (workspace: AppWorkspace) => void
}

function EditWorkspaceModal({ title }: EditWorkspaceModalProps) {
  const { t } = useTranslation()
  const workspace = useSelector(selectWorkspaceWithCurrentState)

  const { workspaceModalOpen, dispatchWorkspaceModalOpen } =
    useSaveWorkspaceModalConnect('editWorkspace')

  const onClose = () => {
    dispatchWorkspaceModalOpen(false)
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={title || t((t) => t.workspace.edit)}
      isOpen={workspaceModalOpen}
      shouldCloseOnEsc
      contentClassName={styles.modal}
      onClose={onClose}
      parentSelector={getModalParent}
    >
      <EditWorkspace workspace={workspace} onFinish={onClose} />
    </Modal>
  )
}

export default EditWorkspaceModal
