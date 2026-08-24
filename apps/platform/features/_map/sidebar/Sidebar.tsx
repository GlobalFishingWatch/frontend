import { lazy, type ReactNode, Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'

import { selectDataviewsResources } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'
import { SCROLL_CONTAINER_DOM_ID } from 'features/_map/sidebar/sidebar.utils'
import { selectScreenshotMode } from 'features/_map/workspace/selectors/app.selectors'
import { selectTrackCorrectionOpen } from 'features/_vessels/track-correction/track-selection.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchResourceThunk } from 'features/data/resources/resources.slice'
import { selectIsWorkspaceSearchLocation } from 'router/routes.selectors'

import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

/**
 * Lazy: only mounted while a track correction is open, and it statically reaches 132 modules.
 */
const TrackCorrection = lazy(() => import('features/_vessels/track-correction/TrackCorrection'))

type SidebarProps = {
  children: ReactNode
}

function Sidebar({ children }: SidebarProps) {
  const dispatch = useAppDispatch()
  const screenshotMode = useSelector(selectScreenshotMode)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)
  const isWorkspaceSearchLocation = useSelector(selectIsWorkspaceSearchLocation)

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
      {!screenshotMode && <SidebarHeader />}
      <div
        id={SCROLL_CONTAINER_DOM_ID}
        className={cx('scrollContainer', styles.scrollContainer, {
          [styles.workspaceSearchScrollContainer]: isWorkspaceSearchLocation,
        })}
        data-testid="sidebar-container"
      >
        <Suspense fallback={null}>{isTrackCorrectionOpen && <TrackCorrection />}</Suspense>
        {!isTrackCorrectionOpen && (
          <div
            className={cx(styles.scrollContent, {
              [styles.scrollContentFill]: isWorkspaceSearchLocation,
            })}
          >
            {children}
            {!isWorkspaceSearchLocation && <div className={styles.bottomSpacer} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
