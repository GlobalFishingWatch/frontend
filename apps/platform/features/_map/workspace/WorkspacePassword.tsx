import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, InputText } from '@globalfishingwatch/ui-components'

import { VALID_PASSWORD } from 'data/map/config'
import {
  isWorkspacePasswordProtected,
  selectWorkspacePassword,
} from 'features/_map/workspace/workspace.selectors'
import { fetchWorkspaceThunk, setWorkspacePassword } from 'features/_map/workspace/workspace.slice'
import { MIN_WORKSPACE_PASSWORD_LENGTH } from 'features/_map/workspace/workspace.utils'
import { useFetchWorkspace } from 'features/_map/workspace/workspace-load.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceId } from 'router/routes.selectors'

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
  const fetchWorkspace = useFetchWorkspace()

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (password.length >= MIN_WORKSPACE_PASSWORD_LENGTH) {
      setLoading(true)
      dispatch(setWorkspacePassword(password))
      const action = await fetchWorkspace({ workspaceId: workspaceId!, password })
      if (fetchWorkspaceThunk.fulfilled.match(action)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dataviewInstancesToUpsert, ...workspace } = action.payload
        if (!isWorkspacePasswordProtected(workspace)) {
          dispatch(setWorkspacePassword(VALID_PASSWORD))
        }
      }
      setLoading(false)
    } else {
      setError(t((t) => t.workspace.passwordMinLength))
    }
  }

  return (
    <ErrorPlaceholder title={t((t) => t.workspace.passwordProtected)}>
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
            <p className={styles.error}>{t((t) => t.workspace.passwordIncorrect)}</p>
          )}
        </div>
        <Button
          size="default"
          htmlType="submit"
          className={styles.passwordButton}
          tooltip={
            !password || password.length < MIN_WORKSPACE_PASSWORD_LENGTH
              ? t((t) => t.workspace.passwordMinLength)
              : undefined
          }
          tooltipPlacement="top"
          disabled={!password || password.length < MIN_WORKSPACE_PASSWORD_LENGTH}
          loading={loading}
        >
          {t((t) => t.common.send) as string}
        </Button>
      </form>
    </ErrorPlaceholder>
  )
}
