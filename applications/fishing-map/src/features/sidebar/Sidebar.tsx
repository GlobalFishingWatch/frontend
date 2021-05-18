import React, { lazy, Suspense, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Button from '@globalfishingwatch/ui-components/dist/button'
import GFWAPI from '@globalfishingwatch/api-client'
import { logoutUserThunk } from 'features/user/user.slice'
import { isGuestUser, isUserAuthorized, isUserLogged } from 'features/user/user.selectors'
import { selectSearchQuery } from 'features/app/app.selectors'
import { selectLocationType } from 'routes/routes.selectors'
import { USER, WORKSPACES_LIST } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

const Analysis = lazy(() => import(/* webpackChunkName: "Analyis" */ 'features/analysis/Analysis'))
const User = lazy(() => import(/* webpackChunkName: "User" */ 'features/user/User'))
const Workspace = lazy(
  () => import(/* webpackChunkName: "Workspace" */ 'features/workspace/Workspace')
)
const WorkspacesList = lazy(
  () => import(/* webpackChunkName: "WorkspacesList" */ 'features/workspaces-list/WorkspacesList')
)
const Search = lazy(() => import(/* webpackChunkName: "Search" */ 'features/search/Search'))
const NewDataset = lazy(
  () => import(/* webpackChunkName: "NewDataset" */ 'features/datasets/NewDataset')
)

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const { t } = useTranslation()
  const isAnalyzing = useSelector(selectIsAnalyzing)
  const searchQuery = useSelector(selectSearchQuery)
  const locationType = useSelector(selectLocationType)
  const guestUser = useSelector(isGuestUser)
  const userLogged = useSelector(isUserLogged)
  const userAuthorized = useSelector(isUserAuthorized)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const dispatch = useDispatch()

  const sidebarComponent = useMemo(() => {
    if (!userLogged || highlightedWorkspacesStatus === AsyncReducerStatus.Loading) {
      return <Spinner />
    }
    // TODO remove once public release and permissions to use map in anonymous user
    if (!userAuthorized) {
      return (
        <div className={styles.placeholder}>
          {guestUser ? (
            <h2>You need to login to see this view</h2>
          ) : (
            <h2>We're sorry but your user is not authorized to use this app yet</h2>
          )}
          {guestUser ? (
            <Button
              className={styles.errorBtn}
              href={GFWAPI.getLoginUrl(window.location.toString())}
            >
              {t('common.login', 'Log in') as string}
            </Button>
          ) : (
            <Button
              className={styles.errorBtn}
              onClick={async () => {
                dispatch(logoutUserThunk({ redirectToLogin: true }))
              }}
            >
              Logout
            </Button>
          )}
        </div>
      )
    }

    if (locationType === USER) {
      return <User />
    }
    if (locationType === WORKSPACES_LIST) {
      return <WorkspacesList />
    }
    return <Workspace />
  }, [
    dispatch,
    locationType,
    userAuthorized,
    userLogged,
    highlightedWorkspacesStatus,
    guestUser,
    t,
  ])

  if (searchQuery !== undefined) {
    return (
      <Suspense fallback={null}>
        <Search />
      </Suspense>
    )
  }

  if (isAnalyzing) {
    return (
      <Suspense fallback={null}>
        <Analysis />
      </Suspense>
    )
  }

  return (
    <div className={styles.container}>
      <CategoryTabs onMenuClick={onMenuClick} />
      {/* New dataset modal is used in user and workspace pages*/}
      <NewDataset />
      <div className="scrollContainer">
        <SidebarHeader />
        <Suspense fallback={null}>{sidebarComponent}</Suspense>
      </div>
    </div>
  )
}

export default Sidebar
