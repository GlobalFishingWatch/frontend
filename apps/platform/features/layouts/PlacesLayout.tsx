import { Suspense } from 'react'
import { Outlet } from '@tanstack/react-router'
import cx from 'classnames'

import { Logo } from '@globalfishingwatch/ui-components/logo'

import { SCROLL_CONTAINER_DOM_ID } from 'features/_map/sidebar/sidebar.utils'

import styles from './layouts.module.css'

function PlacesLayout() {
  return (
    <div className={styles.contentLayout}>
      <div className={styles.contentHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} />
        </a>
      </div>
      <div
        id={SCROLL_CONTAINER_DOM_ID}
        className={cx('scrollContainer', styles.contentScrollContainer)}
      >
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default PlacesLayout
