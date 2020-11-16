import React, { memo, useState, Fragment, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { AsyncReducerStatus } from 'types'
import useDebugMenu from 'features/debug/debug.hooks'
import { MapboxRefProvider } from 'features/map/map.context'
import {
  fetchWorkspaceThunk,
  selectWorkspaceCustom,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.slice'
import {
  selectWorkspace,
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
import { isUserLogged } from 'features/user/user.slice'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectSidebarOpen } from './app.selectors'
import styles from './App.module.css'

import '@globalfishingwatch/ui-components/dist/base.css'

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
  const logged = useSelector(isUserLogged)
  const workspaceId = useSelector(selectWorkspaceId)
  const workspaceData = useSelector(selectWorkspace)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustom = useSelector(selectWorkspaceCustom)

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  const onToggle = () => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }

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
    if (logged && workspaceData === null) {
      dispatch(fetchWorkspaceThunk(workspaceId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, logged, workspaceId])

  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

  return (
    <Fragment>
      <Login />
      {!logged || (workspaceStatus !== AsyncReducerStatus.Finished && !workspaceCustom) ? (
        <div className={styles.placeholder}>
          {workspaceStatus === AsyncReducerStatus.Error ? (
            <div>
              <h2>There was an error loading your view</h2>
              <Button onClick={onUseDefaultWorkspaceClick}>Load default view</Button>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      ) : (
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
      )}
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
