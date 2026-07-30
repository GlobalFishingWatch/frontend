import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Outlet } from '@tanstack/react-router'

import { Menu } from '@globalfishingwatch/ui-components/menu'

import menuBgImage from 'assets/images/menubg.jpg'
import { ROOT_DOM_ELEMENT } from 'data/map/config'
import { useAppShell } from 'features/app/app-shell.hooks'
import ErrorBoundary from 'features/app/ErrorBoundary'
import { selectReadOnly } from 'features/map/workspace/selectors/app.selectors'
import AppModals from 'features/modals/Modals'
import MainNav from 'features/nav/MainNav'
import { ConfirmLeave } from 'router/ConfirmLeave'

import styles from './layouts.module.css'

function PlatformLayout() {
  useAppShell()

  const readOnly = useSelector(selectReadOnly)
  const [menuOpen, setMenuOpen] = useState(false)

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  return (
    <Fragment>
      <ConfirmLeave />
      <div className={styles.platformLayout}>
        <MainNav onMenuClick={onMenuClick} />
        <div className={styles.platformContent}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
      {!readOnly && (
        <Menu
          appSelector={ROOT_DOM_ELEMENT}
          bgImage={menuBgImage}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          activeLinkId="map-data"
        />
      )}
      <AppModals />
      <ToastContainer position="top-center" className={styles.toastContainer} closeButton={false} />
    </Fragment>
  )
}

export default PlatformLayout
