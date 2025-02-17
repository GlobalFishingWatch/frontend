import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, InputText } from '@globalfishingwatch/ui-components'

import { VALID_PASSWORD } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useFitWorkspaceBounds } from 'features/workspace/workspace.hook'
import {
  isWorkspacePasswordProtected,
  selectWorkspacePassword,
} from 'features/workspace/workspace.selectors'
import { fetchWorkspaceThunk, setWorkspacePassword } from 'features/workspace/workspace.slice'
import { MIN_WORKSPACE_PASSWORD_LENGTH } from 'features/workspace/workspace.utils'
import { selectWorkspaceId } from 'routes/routes.selectors'

import ErrorPlaceholder from './ErrorPlaceholder'

import styles from './Workspace.module.css'

export default function WorkspacePassword() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectWorkspaceId)
  const workspacePassword = useSelector(selectWorkspacePassword)
  const fitWorkspaceBounds = useFitWorkspaceBounds()

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (password.length >= MIN_WORKSPACE_PASSWORD_LENGTH) {
      setLoading(true)
      dispatch(setWorkspacePassword(password))
      const action = await dispatch(fetchWorkspaceThunk({ workspaceId, password }))
      if (fetchWorkspaceThunk.fulfilled.match(action)) {
        const workspace = action.payload
        if (!isWorkspacePasswordProtected(workspace)) {
          fitWorkspaceBounds(workspace)
          dispatch(setWorkspacePassword(VALID_PASSWORD))
        }
      }
      setLoading(false)
    } else {
      setError(t('workspace.passwordMinLength', 'Password must be at least 5 characters'))
    }
  }

  return (
    <ErrorPlaceholder
      title={t('workspace.passwordProtected', 'This workspace is password protected')}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <InputText
            value={password}
            className={styles.password}
            type="password"
            invalid={!!error || !!workspacePassword}
            testId="create-workspace-password"
            onChange={handlePasswordChange}
          />
          {error && <p className={styles.error}>{error}</p>}
          {!error && workspacePassword && (
            <p className={styles.error}>{t('workspace.passwordIncorrect', 'Invalid password')}</p>
          )}
        </div>
        <Button
          size="default"
          htmlType="submit"
          className={styles.passwordButton}
          tooltip={
            !password || password.length < MIN_WORKSPACE_PASSWORD_LENGTH
              ? t('workspace.passwordMinLength', 'passwordMinLength')
              : undefined
          }
          tooltipPlacement="top"
          disabled={!password || password.length < MIN_WORKSPACE_PASSWORD_LENGTH}
          loading={loading}
        >
          {t('common.send', 'Send') as string}
        </Button>
      </form>
    </ErrorPlaceholder>
  )
}
