import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button } from '@globalfishingwatch/ui-components'
import { selectWorkspaceError } from 'features/workspace/workspace.selectors'
import { isGuestUser, logoutUserThunk, selectUserData } from 'features/user/user.slice'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import LocalStorageLoginLink from 'routes/LoginLink'
import { SUPPORT_EMAIL } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceVesselGroupsError } from 'features/vessel-groups/vessel-groups.slice'
import styles from './Workspace.module.css'

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
  emailSubject: string
}) {
  const { t } = useTranslation()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const guestUser = useSelector(isGuestUser)
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
          <Button href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}`}>
            {t('errors.requestAccess', 'Request access') as string}
          </Button>
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
  if (
    error.status === 401 ||
    error.status === 403 ||
    vesselGroupsError?.status === 401 ||
    vesselGroupsError?.status === 403
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
          Load default view
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

export default WorkspaceError
