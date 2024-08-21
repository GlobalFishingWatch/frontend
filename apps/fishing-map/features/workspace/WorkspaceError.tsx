import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button, InputText } from '@globalfishingwatch/ui-components'
import { isAuthError } from '@globalfishingwatch/api-client'
import { Workspace } from '@globalfishingwatch/api-types'
import {
  isWorkspacePasswordProtected,
  selectWorkspace,
  selectWorkspaceError,
  selectWorkspacePassword,
} from 'features/workspace/workspace.selectors'
import { logoutUserThunk } from 'features/user/user.slice'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import LocalStorageLoginLink from 'routes/LoginLink'
import { SUPPORT_EMAIL } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceVesselGroupsError } from 'features/vessel-groups/vessel-groups.slice'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { VALID_PASSWORD } from 'data/config'
import styles from './Workspace.module.css'
import { fetchWorkspaceThunk, setWorkspacePassword } from './workspace.slice'
import { MIN_WORKSPACE_PASSWORD_LENGTH, isPrivateWorkspaceNotAllowed } from './workspace.utils'
import { useFitWorkspaceBounds } from './workspace.hook'

export function ErrorPlaceHolder({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className={styles.placeholder}>
      <div>
        <h2 className={styles.errorTitle}>{title}</h2>
        {children && children}
      </div>
    </div>
  )
}
export function WorkspaceLoginError({
  title,
  emailSubject,
}: {
  title: string
  emailSubject?: string
}) {
  const { t } = useTranslation()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const userData = useSelector(selectUserData)
  const dispatch = useAppDispatch()
  return (
    <ErrorPlaceHolder title={title}>
      {guestUser ? (
        <LocalStorageLoginLink className={styles.button}>
          {t('common.login', 'Log in') as string}
        </LocalStorageLoginLink>
      ) : (
        <Fragment>
          {emailSubject && (
            <Button href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}`}>
              {t('errors.requestAccess', 'Request access') as string}
            </Button>
          )}
          {userData?.email && (
            <p className={styles.logged}>
              {t('common.loggedAs', 'Logged as')} {userData.email}
            </p>
          )}
          <Button
            type="secondary"
            size="small"
            loading={logoutLoading}
            onClick={async () => {
              setLogoutLoading(true)
              await dispatch(logoutUserThunk({ loginRedirect: true }))
              setLogoutLoading(false)
            }}
          >
            {t('errors.switchAccount', 'Switch account') as string}
          </Button>
        </Fragment>
      )}
    </ErrorPlaceHolder>
  )
}

function WorkspaceError(): React.ReactElement {
  const error = useSelector(selectWorkspaceError)
  const vesselGroupsError = useSelector(selectWorkspaceVesselGroupsError)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectWorkspaceId)
  const workspace = useSelector(selectWorkspace)
  if (
    isAuthError(error) ||
    isAuthError(vesselGroupsError) ||
    isPrivateWorkspaceNotAllowed(workspace)
  ) {
    return (
      <WorkspaceLoginError
        title={t('errors.privateView', 'This is a private view')}
        emailSubject={`Requesting access for ${workspaceId} view`}
      />
    )
  }
  if (error.status === 404) {
    return (
      <ErrorPlaceHolder title={t('errors.workspaceNotFound', 'The view you request was not found')}>
        <Button
          onClick={() => {
            dispatch(
              updateLocation(HOME, {
                payload: { workspaceId: undefined },
                query: {},
                replaceQuery: true,
              })
            )
          }}
        >
          {t('errors.loadDefaultWorkspace', 'Load default workspace')}
        </Button>
      </ErrorPlaceHolder>
    )
  }
  return (
    <ErrorPlaceHolder
      title={t(
        'errors.workspaceLoad',
        'There was an error loading the workspace, please try again later'
      )}
    ></ErrorPlaceHolder>
  )
}

export function WorkspacePassword(): React.ReactElement {
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
        const workspace = action.payload as Workspace
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
    <ErrorPlaceHolder
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
    </ErrorPlaceHolder>
  )
}

export default WorkspaceError
