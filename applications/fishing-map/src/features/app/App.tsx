import React, { memo, useState, Fragment, useEffect, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { AsyncReducerStatus } from 'types'
import useDebugMenu from 'features/debug/debug.hooks'
import { MapboxRefProvider } from 'features/map/map.context'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  selectWorkspace,
  selectWorkspaceCustom,
  selectWorkspaceStatus,
  selectDataviewsResourceQueries,
} from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { selectWorkspaceId } from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect } from 'routes/routes.hook'
import DebugMenu from 'features/debug/DebugMenu'
import Login from 'features/user/Login'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'
import Sidebar from 'features/sidebar/Sidebar'
import { isUserAuthorized, isUserLogged } from 'features/user/user.slice'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectSidebarOpen } from './app.selectors'
import styles from './App.module.css'

import '@globalfishingwatch/ui-components/dist/base.css'

const ErrorPlaceHolder = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.placeholder}>
    <div>{children}</div>
  </div>
)

const Main = memo(() => (
  <div className={styles.main}>
    <Map />
    <Timebar />
  </div>
))

function App(): React.ReactElement {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const userLogged = useSelector(isUserLogged)
  const userAuthorized = useSelector(isUserAuthorized)
  const workspaceId = useSelector(selectWorkspaceId)
  const workspaceData = useSelector(selectWorkspace)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustom = useSelector(selectWorkspaceCustom)

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const onUseDefaultWorkspaceClick = useCallback(() => {
    dispatch(
      updateLocation(HOME, {
        payload: { workspaceId: undefined },
        query: {},
        replaceQuery: true,
      })
    )
  }, [dispatch])

  useEffect(() => {
    if (userLogged && workspaceData === null) {
      dispatch(fetchWorkspaceThunk(workspaceId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userLogged, workspaceId])

  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

  const Content = useMemo(() => {
    if (!userLogged) {
      return <Spinner />
    }

    if (!userAuthorized) {
      return (
        <ErrorPlaceHolder>
          <h2>We're sorry but your user is not authorized to use this app yet</h2>
        </ErrorPlaceHolder>
      )
    }

    if (workspaceStatus === AsyncReducerStatus.Error) {
      return (
        <ErrorPlaceHolder>
          <h2>There was an error loading your view</h2>
          <Button onClick={onUseDefaultWorkspaceClick}>Load default view</Button>
        </ErrorPlaceHolder>
      )
    }

    return workspaceStatus === AsyncReducerStatus.Finished || workspaceCustom ? (
      <MapboxRefProvider>
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggle}
          aside={<Sidebar onMenuClick={onMenuClick} />}
          main={<Main />}
          asideWidth="32rem"
          className="split-container"
        />
      </MapboxRefProvider>
    ) : (
      <Spinner />
    )
  }, [
    onMenuClick,
    onToggle,
    onUseDefaultWorkspaceClick,
    sidebarOpen,
    userAuthorized,
    userLogged,
    workspaceCustom,
    workspaceStatus,
  ])

  return (
    <Fragment>
      <Login />
      {Content}
      <Menu
        bgImage={menuBgImage}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeLinkId="map-data"
      />
      <Modal
        title="Secret debug menu 🤖"
        isOpen={debugActive}
        onClose={() => dispatchToggleDebugMenu()}
      >
        <DebugMenu />
      </Modal>
    </Fragment>
  )
}

export default App
