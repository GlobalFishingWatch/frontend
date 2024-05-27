import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button, Modal } from '@globalfishingwatch/ui-components'
import { WORKSPACE_PASSWORD_ACCESS } from '@globalfishingwatch/api-types'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { updatedCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { selectUserData } from 'features/user/selectors/user.selectors'
import styles from './WorkspaceSaveModal.module.css'
import { useSaveWorkspaceModalConnect } from './workspace-save.hooks'

type EditWorkspaceModalProps = {
  title?: string
  isOpen: boolean
  onFinish?: (workspace: AppWorkspace) => void
}

function EditWorkspaceModal({ title, isOpen, onFinish }: EditWorkspaceModalProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const [name, setName] = useState(workspace?.name)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const userData = useSelector(selectUserData)
  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const isPassWordEditAccess = workspace?.editAccess === WORKSPACE_PASSWORD_ACCESS

  const { dispatchWorkspaceModalOpen } = useSaveWorkspaceModalConnect('editWorkspace')

  const onClose = () => {
    dispatchWorkspaceModalOpen(false)
  }

  const updateWorkspace = async () => {
    if (workspace) {
      setLoading(true)
      const dispatchedAction = await dispatch(
        updatedCurrentWorkspaceThunk({ ...workspace, name, password })
      )
      if (updatedCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        const workspace = dispatchedAction.payload as AppWorkspace
        if (!workspace?.dataviewInstances.length) {
          setError(t('workspace.passwordIncorrect', 'Invalid password'))
        }
        trackEvent({
          category: TrackCategory.WorkspaceManagement,
          action: 'Edit current workspace',
          label: dispatchedAction.payload?.name ?? 'Unknown',
        })
        setLoading(false)
        if (onFinish) {
          onFinish(dispatchedAction.payload)
        }
        onClose()
      } else {
        const error = (dispatchedAction.payload as any)?.error as ParsedAPIError
        if (error.status === 401) {
          setError(t('workspace.passwordIncorrect', 'Invalid password'))
        } else {
          setError('Error updating workspace')
        }
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    updateWorkspace()
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={title || t('workspace.edit', 'Edit workspace')}
      isOpen={isOpen}
      shouldCloseOnEsc
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <InputText
          value={name}
          className={styles.input}
          testId="create-workspace-name"
          label={t('common.name', 'Name')}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        {isPassWordEditAccess && !isOwnerWorkspace && (
          <InputText
            value={password}
            className={styles.select}
            type="password"
            testId="create-workspace-password"
            label={t('common.password', 'password')}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <div className={styles.footer}>
          {error && <p className={styles.error}>{error}</p>}
          <Button
            loading={loading}
            disabled={!name}
            onClick={updateWorkspace}
            htmlType="submit"
            testId="create-workspace-button"
          >
            {t('workspace.edit', 'Edit workspace') as string}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditWorkspaceModal
