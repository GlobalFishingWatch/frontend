import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Outlet } from '@tanstack/react-router'

import { Menu } from '@globalfishingwatch/ui-components/menu'

import menuBgImage from 'assets/images/menubg.jpg'
import { ROOT_DOM_ELEMENT } from 'data/map/config'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import { useAppShell } from 'features/app/app-shell.hooks'
import ErrorBoundary from 'features/app/ErrorBoundary'
import AppModals from 'features/modals/Modals'
import LegacyNav from 'features/nav/LegacyNav'
import { PLATFORM_MODE } from 'features/nav/nav.config'
import PlatformNav from 'features/nav/PlatformNav'
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
        {PLATFORM_MODE ? <PlatformNav /> : <LegacyNav onMenuClick={onMenuClick} />}
        <div className={styles.platformContent}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
      {/* Platform mode drops the hamburger for the expanding rail, so nothing can open this. */}
      {!readOnly && !PLATFORM_MODE && (
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
