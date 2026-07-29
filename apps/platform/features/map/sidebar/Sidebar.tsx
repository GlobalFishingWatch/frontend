import { lazy, type ReactNode, Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'

import { useAppDispatch } from 'features/app/app.hooks'
import { fetchResourceThunk } from 'features/data/resources/resources.slice'
import { selectDataviewsResources } from 'features/map/dataviews/selectors/dataviews.resolvers.selectors'
import { SCROLL_CONTAINER_DOM_ID } from 'features/map/sidebar/sidebar.utils'
import { selectScreenshotMode } from 'features/map/workspace/selectors/app.selectors'
import { selectTrackCorrectionOpen } from 'features/vessels/track-correction/track-selection.selectors'
import { selectIsAnySearchLocation } from 'router/routes.selectors'

import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

/**
 * Lazy: only mounted while a track correction is open, and it statically reaches 132 modules.
 */
const TrackCorrection = lazy(() => import('features/vessels/track-correction/TrackCorrection'))

type SidebarProps = {
  children: ReactNode
}

function Sidebar({ children }: SidebarProps) {
  const dispatch = useAppDispatch()
  const screenshotMode = useSelector(selectScreenshotMode)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)

  useEffect(() => {
    if (dataviewsResources?.resources?.length) {
      const infoResources = dataviewsResources?.resources.filter(
        (r) => r.dataset.type === DatasetTypes.Vessels
      )
      infoResources.forEach((resource) => {
        dispatch(
          fetchResourceThunk({
            resource,
            resourceKey: resource.key,
          })
        )
      })
    }
  }, [dispatch, dataviewsResources])

  return (
    <div className={cx(styles.container, { [styles.overlay]: isTrackCorrectionOpen })}>
      <div className={styles.content}>
        {!screenshotMode && <SidebarHeader />}
        <div
          id={SCROLL_CONTAINER_DOM_ID}
          className={cx('scrollContainer', styles.scrollContainer)}
          data-testid="sidebar-container"
        >
          <Suspense fallback={null}>{isTrackCorrectionOpen && <TrackCorrection />}</Suspense>
          <div className={cx(styles.scrollContent, { [styles.hidden]: isTrackCorrectionOpen })}>
            {children}
            {!isAnySearchLocation && <div className={styles.bottomSpacer} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
