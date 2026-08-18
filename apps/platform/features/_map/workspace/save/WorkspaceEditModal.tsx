import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Modal } from '@globalfishingwatch/ui-components'

import { selectWorkspaceWithCurrentState } from 'features/_map/workspace/selectors/app.workspace.selectors'
import type { AppWorkspace } from 'features/_map/workspaces-list/workspaces-list.slice'

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
      title={title || t((t) => t.workspace.edit)}
      isOpen={workspaceModalOpen}
      shouldCloseOnEsc
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <EditWorkspace workspace={workspace} onFinish={onClose} />
    </Modal>
  )
}

export default EditWorkspaceModal
