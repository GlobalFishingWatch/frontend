import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button } from '@globalfishingwatch/ui-components'
import { WORKSPACE_PASSWORD_ACCESS } from '@globalfishingwatch/api-types'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { updatedCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { AppWorkspace, updateWorkspaceThunk } from 'features/workspaces-list/workspaces-list.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectUserData } from 'features/user/selectors/user.selectors'
import styles from './WorkspaceSaveModal.module.css'

type EditWorkspaceProps = {
  workspace: AppWorkspace
  isWorkspaceList?: boolean
  onFinish?: (workspace: AppWorkspace) => void
}

function EditWorkspace({ workspace, isWorkspaceList = false, onFinish }: EditWorkspaceProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [name, setName] = useState(workspace?.name)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const userData = useSelector(selectUserData)
  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const isPassWordEditAccess = workspace?.editAccess === WORKSPACE_PASSWORD_ACCESS

  const updateWorkspace = async () => {
    if (workspace) {
      setLoading(true)
      const dispatchedAction = isWorkspaceList
        ? await dispatch(updateWorkspaceThunk({ ...workspace, name, password }))
        : await dispatch(updatedCurrentWorkspaceThunk({ ...workspace, name, password }))
      if (
        updateWorkspaceThunk.fulfilled.match(dispatchedAction) ||
        updatedCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)
      ) {
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
      } else {
        const error = (dispatchedAction.payload as any)?.error as ParsedAPIError
        if (error?.status === 401) {
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
  )
}

export default EditWorkspace
