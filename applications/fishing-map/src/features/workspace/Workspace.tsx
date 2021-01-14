import React, { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import GFWAPI from '@globalfishingwatch/api-client'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  selectWorkspaceStatus,
  selectDataviewsResourceQueries,
  selectCurrentWorkspaceId,
  selectWorkspaceError,
  isWorkspaceLoading,
} from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { AsyncReducerStatus } from 'types'
import { isGuestUser, isUserLogged } from 'features/user/user.selectors'
import { selectLocationType, selectWorkspaceId } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { logoutUserThunk } from 'features/user/user.slice'
import HeatmapsSection from './heatmaps/HeatmapsSection'
import VesselsSection from './vessels/VesselsSection'
import EnvironmentalSection from './environmental/EnvironmentalSection'
import ContextAreaSection from './context-areas/ContextAreaSection'
import styles from './Workspace.module.css'

function WorkspaceError(): React.ReactElement {
  const error = useSelector(selectWorkspaceError)
  const workspaceId = useSelector(selectWorkspaceId)
  const guestUser = useSelector(isGuestUser)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const ErrorPlaceHolder = ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <div className={styles.placeholder}>
      <div>
        <h2 className={styles.errorTitle}>{title}</h2>
        {children && children}
      </div>
    </div>
  )
  if (error.status === 401) {
    return (
      <ErrorPlaceHolder title={t('errors.privateView', 'This is a private view')}>
        {guestUser ? (
          <Button href={GFWAPI.getLoginUrl(window.location.toString())}>
            {t('common.login', 'Login') as string}
          </Button>
        ) : (
          <Fragment>
            <Button
              href={`mailto:support@globalfishingwatch.org?subject=Requesting access for ${workspaceId} view`}
            >
              {t('errors.requestAccess', 'Request access') as string}
            </Button>
            <p className={styles.logged}>
              {t('common.loggedAs', 'Logged as')} joseangel@globalfishingwatch.org
            </p>
            <Button
              type="secondary"
              size="small"
              onClick={async () => {
                await dispatch(logoutUserThunk({ redirectToLogin: true }))
              }}
            >
              {t('errors.switchAccount', 'Switch account') as string}
            </Button>
          </Fragment>
        )}
      </ErrorPlaceHolder>
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

function Workspace() {
  const dispatch = useDispatch()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceLoading = useSelector(isWorkspaceLoading)
  const userLogged = useSelector(isUserLogged)
  const locationType = useSelector(selectLocationType)
  const workspaceId = useSelector(selectWorkspaceId)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)

  useEffect(() => {
    if (userLogged) {
      if (locationType === HOME || currentWorkspaceId !== workspaceId) {
        dispatch(fetchWorkspaceThunk(workspaceId as string))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, workspaceId])

  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

  if (workspaceLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (workspaceStatus === AsyncReducerStatus.Error) {
    return <WorkspaceError />
  }

  return (
    <Fragment>
      <HeatmapsSection />
      <VesselsSection />
      <EnvironmentalSection />
      <ContextAreaSection />
    </Fragment>
  )
}

export default Workspace
