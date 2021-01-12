import React, { useState, Fragment, useCallback, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { AsyncReducerStatus } from 'types'
import useDebugMenu from 'features/debug/debug.hooks'
import { MapboxRefProvider } from 'features/map/map.context'
import { selectWorkspaceStatus, selectWorkspaceError } from 'features/workspace/workspace.selectors'
import { isWorkspaceLocation, selectWorkspaceId } from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect } from 'routes/routes.hook'
import DebugMenu from 'features/debug/DebugMenu'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'
import Sidebar from 'features/sidebar/Sidebar'
import { logoutUserThunk, fetchUserThunk } from 'features/user/user.slice'
import { isUserAuthorized, isUserLogged } from 'features/user/user.selectors'
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

const Main = () => {
  const showTimebar = useSelector(isWorkspaceLocation)
  return (
    <div className={styles.main}>
      <Map />
      {showTimebar && <Timebar />}
    </div>
  )
}

function AppError(): React.ReactElement {
  const error = useSelector(selectWorkspaceError)
  const workspaceId = useSelector(selectWorkspaceId)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  if (error.status === 401) {
    return (
      <ErrorPlaceHolder>
        <h2>{t('errors.notAllowed', 'You need access to this view')}</h2>
        <a
          className={styles.link}
          href={`mailto:support@globalfishingwatch.org?subject=Requesting access for ${workspaceId} view`}
        >
          {t('errors.askAccess', 'Ask for access')}
        </a>{' '}
        <span>{t('common.or', 'or') as string}</span>{' '}
        <Button
          onClick={() => {
            dispatch(logoutUserThunk({ redirect: true }))
          }}
        >
          {t('errors.switchAccount', 'Switch account') as string}
        </Button>
      </ErrorPlaceHolder>
    )
  }
  if (error.status === 404) {
    return (
      <ErrorPlaceHolder>
        <h2>{t('errors.workspaceNotFound', 'The view you request was not found')}</h2>
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
    <ErrorPlaceHolder>
      <h2>
        {t(
          'errors.workspaceLoad',
          'There was an error loading the workspace, please try again later'
        )}
      </h2>
    </ErrorPlaceHolder>
  )
}
function App(): React.ReactElement {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const userLogged = useSelector(isUserLogged)
  const userAuthorized = useSelector(isUserAuthorized)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const narrowSidebar = useSelector(isWorkspaceLocation)

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const Content = useMemo(() => {
    if (!userLogged) {
      return <Spinner />
    }

    if (!userAuthorized) {
      return (
        <ErrorPlaceHolder>
          <h2>We're sorry but your user is not authorized to use this app yet</h2>
          <Button
            onClick={() => {
              dispatch(logoutUserThunk({ redirect: false }))
            }}
          >
            Logout
          </Button>
        </ErrorPlaceHolder>
      )
    }

    if (workspaceStatus === AsyncReducerStatus.Error) {
      return <AppError />
    }

    return (
      <MapboxRefProvider>
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggle}
          aside={<Sidebar onMenuClick={onMenuClick} />}
          main={<Main />}
          asideWidth={narrowSidebar ? '37rem' : '50%'}
          className="split-container"
        />
      </MapboxRefProvider>
    )
  }, [
    dispatch,
    narrowSidebar,
    onMenuClick,
    onToggle,
    sidebarOpen,
    userAuthorized,
    userLogged,
    workspaceStatus,
  ])

  return (
    <Fragment>
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
