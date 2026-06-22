import { type ReactNode, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly, selectScreenshotMode } from 'features/app/selectors/app.selectors'
import { selectDataviewsResources } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { SCROLL_CONTAINER_DOM_ID } from 'features/sidebar/sidebar.utils'
import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import TrackCorrection from 'features/track-correction/TrackCorrection'

import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

type SidebarProps = {
  onMenuClick: () => void
  children: ReactNode
}

function Sidebar({ onMenuClick, children }: SidebarProps) {
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const screenshotMode = useSelector(selectScreenshotMode)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const isPrinting = useSelector(selectScreenshotModalOpen)
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)

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

  const content = useMemo(() => {
    if (isTrackCorrectionOpen) {
      return <TrackCorrection />
    }

    return children
  }, [isTrackCorrectionOpen, children])

  const showTabs =
    !readOnly && !isSmallScreen && !isPrinting && !isTrackCorrectionOpen && !screenshotMode
  return (
    <div className={cx(styles.container, { [styles.overlay]: isTrackCorrectionOpen })}>
      <div className={cx(styles.content, { [styles.withoutTabs]: !showTabs })}>
        {!screenshotMode && <SidebarHeader />}
        <div
          id={SCROLL_CONTAINER_DOM_ID}
          className={cx('scrollContainer', styles.scrollContainer)}
          data-testid="sidebar-container"
        >
          {content}
        </div>
      </div>
      {showTabs && <CategoryTabs onMenuClick={onMenuClick} />}
    </div>
  )
}

export default Sidebar
