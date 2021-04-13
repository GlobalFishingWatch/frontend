import React, { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import GFWAPI from '@globalfishingwatch/api-client'
import Search from 'features/search/Search'
import {
  selectWorkspaceStatus,
  selectWorkspaceError,
  selectWorkspace,
} from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { isGuestUser } from 'features/user/user.selectors'
import { selectLocationCategory, selectWorkspaceId } from 'routes/routes.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { logoutUserThunk, selectUserData } from 'features/user/user.slice'
import { selectSearchQuery } from 'features/app/app.selectors'
import { SUPPORT_EMAIL } from 'data/config'
import { WorkspaceCategories } from 'data/workspaces'
import { selectDataviewsResourceQueries } from 'features/resources/resources.selectors'
import HeatmapsSection from './heatmaps/HeatmapsSection'
import VesselsSection from './vessels/VesselsSection'
import EventsSection from './events/EventsSection'
import EnvironmentalSection from './environmental/EnvironmentalSection'
import ContextAreaSection from './context-areas/ContextAreaSection'
import styles from './Workspace.module.css'

function WorkspaceError(): React.ReactElement {
  const [logoutLoading, setLogoutLoading] = useState(false)
  const error = useSelector(selectWorkspaceError)
  const workspaceId = useSelector(selectWorkspaceId)
  const guestUser = useSelector(isGuestUser)
  const userData = useSelector(selectUserData)
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
  if (error.status === 401 || error.status === 403) {
    return (
      <ErrorPlaceHolder title={t('errors.privateView', 'This is a private view')}>
        {guestUser ? (
          <Button href={GFWAPI.getLoginUrl(window.location.toString())}>
            {t('common.login', 'Log in') as string}
          </Button>
        ) : (
          <Fragment>
            <Button
              href={`mailto:${SUPPORT_EMAIL}?subject=Requesting access for ${workspaceId} view`}
            >
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
                await dispatch(logoutUserThunk({ redirectToLogin: true }))
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
  const searchQuery = useSelector(selectSearchQuery)
  const workspace = useSelector(selectWorkspace)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const locationCategory = useSelector(selectLocationCategory)

  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

  if (
    workspaceStatus === AsyncReducerStatus.Idle ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (workspaceStatus === AsyncReducerStatus.Error) {
    return <WorkspaceError />
  }

  if (searchQuery !== undefined) {
    return <Search />
  }

  return (
    <Fragment>
      {(locationCategory === WorkspaceCategories.MarineReserves ||
        locationCategory === WorkspaceCategories.FishingActivity) &&
        workspace?.name && <h2 className={styles.title}>{workspace.name}</h2>}
      <HeatmapsSection />
      <VesselsSection />
      <EventsSection />
      <EnvironmentalSection />
      <ContextAreaSection />
    </Fragment>
  )
}

export default Workspace
