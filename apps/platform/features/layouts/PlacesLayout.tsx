import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Outlet } from '@tanstack/react-router'
import cx from 'classnames'

import { Logo } from '@globalfishingwatch/ui-components/logo'

import { SCROLL_CONTAINER_DOM_ID } from 'features/_map/sidebar/sidebar.utils'
import { selectLocationType } from 'router/routes.selectors'

import styles from './layouts.module.css'

/**
 * Layout for /ports and /areas: logo header, page title and a scroll container.
 *
 * Provides `SCROLL_CONTAINER_DOM_ID` for the same reason ContentLayout does — it is an app-wide
 * contract (router-sync scroll reset among others), not a Sidebar detail.
 */
function PlacesLayout() {
  const { t } = useTranslation()
  const locationType = useSelector(selectLocationType)
  const title = locationType === 'AREAS' ? t((t) => t.nav.areas) : t((t) => t.nav.ports)

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
        <h1 className={styles.placesTitle}>{title}</h1>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default PlacesLayout
