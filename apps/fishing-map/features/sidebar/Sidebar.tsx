import { type ReactNode, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectDataviewsResources } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { SCROLL_CONTAINER_DOM_ID } from 'features/sidebar/sidebar.utils'
import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import TrackCorrection from 'features/track-correction/TrackCorrection'
import { selectIsUserLogged, selectUserStatus } from 'features/user/selectors/user.selectors'
import { fetchVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import ErrorPlaceholder from 'features/workspace/ErrorPlaceholder'
import { AsyncReducerStatus } from 'utils/async-slice'

import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

type SidebarProps = {
  onMenuClick: () => void
  children: ReactNode
}

function Sidebar({ onMenuClick, children }: SidebarProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const isUserLogged = useSelector(selectIsUserLogged)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const isPrinting = useSelector(selectScreenshotModalOpen)
  const userStatus = useSelector(selectUserStatus)
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)

  useEffect(() => {
    if (isUserLogged) {
      dispatch(fetchVesselGroupsThunk())
    }
  }, [dispatch, isUserLogged])

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
    if (userStatus === AsyncReducerStatus.Error) {
      return <ErrorPlaceholder title={t((t) => t.errors.userDataError)} />
    }

    if (!isUserLogged) {
      return <Spinner />
    }

    if (isTrackCorrectionOpen) {
      return <TrackCorrection />
    }

    return children
  }, [userStatus, isUserLogged, isTrackCorrectionOpen, children, t])

  const showTabs = !readOnly && !isSmallScreen && !isPrinting && !isTrackCorrectionOpen
  return (
    <div className={cx(styles.container, { [styles.overlay]: isTrackCorrectionOpen })}>
      {showTabs && <CategoryTabs onMenuClick={onMenuClick} />}
      <div className={cx(styles.content, { [styles.withoutTabs]: !showTabs })}>
        <SidebarHeader />
        <div
          id={SCROLL_CONTAINER_DOM_ID}
          className={cx('scrollContainer', styles.scrollContainer)}
          data-test="sidebar-container"
        >
          {content}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
