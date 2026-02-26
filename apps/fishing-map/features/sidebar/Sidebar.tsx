import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import dynamic from 'next/dynamic'

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
import {
  selectIsAnyAreaReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsUserLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspacesListLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

const AreaReport = dynamic(
  () => import(/* webpackChunkName: "AreaReport" */ 'features/reports/report-area/AreaReport')
)
const PortsReport = dynamic(
  () => import(/* webpackChunkName: "PortsReport" */ 'features/reports/report-port/PortsReport')
)
const VesselGroupReport = dynamic(
  () =>
    import(
      /* webpackChunkName: "VesselGroupReport" */ 'features/reports/report-vessel-group/VesselGroupReport'
    )
)
const VesselProfile = dynamic(
  () => import(/* webpackChunkName: "VesselProfile" */ 'features/vessel/Vessel')
)
const User = dynamic(() => import(/* webpackChunkName: "User" */ 'features/user/User'))
const Workspace = dynamic(
  () => import(/* webpackChunkName: "Workspace" */ 'features/workspace/Workspace')
)
const WorkspacesList = dynamic(
  () => import(/* webpackChunkName: "WorkspacesList" */ 'features/workspaces-list/WorkspacesList')
)
const Search = dynamic(() => import(/* webpackChunkName: "Search" */ 'features/search/Search'))

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const isUserLocation = useSelector(selectIsUserLocation)
  const isUserLogged = useSelector(selectIsUserLogged)
  const isWorkspacesListLocation = useSelector(selectIsWorkspacesListLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
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
            // parseEventCb: parseTrackEventChunkProps,
            // parseUserTrackCb: parseUserTrackCallback,
          })
        )
      })
    }
  }, [dispatch, dataviewsResources])

  const sidebarComponent = useMemo(() => {
    if (userStatus === AsyncReducerStatus.Error) {
      return <ErrorPlaceholder title={t((t) => t.errors.userDataError)} />
    }

    if (!isUserLogged) {
      return <Spinner />
    }

    if (isUserLocation) {
      return <User />
    }

    if (isTrackCorrectionOpen) {
      return <TrackCorrection />
    }

    if (isVesselLocation) {
      return <VesselProfile />
    }

    if (isWorkspacesListLocation) {
      return <WorkspacesList />
    }

    if (isAreaReportLocation) {
      return <AreaReport />
    }

    if (isPortReportLocation) {
      return <PortsReport />
    }

    if (isVesselGroupReportLocation) {
      return <VesselGroupReport />
    }

    if (isSearchLocation) {
      return <Search />
    }

    return <Workspace />
  }, [
    userStatus,
    isUserLogged,
    isUserLocation,
    isTrackCorrectionOpen,
    isVesselLocation,
    isWorkspacesListLocation,
    isAreaReportLocation,
    isPortReportLocation,
    isVesselGroupReportLocation,
    isSearchLocation,
    t,
  ])

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
          {sidebarComponent}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
