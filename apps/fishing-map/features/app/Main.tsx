import { Fragment, lazy } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import Footer from 'features/footer/Footer'
import { selectShowTimeComparison } from 'features/reports/report-area/area-reports.selectors'
import {
  selectIsWorkspaceReady,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { VESSEL, WORKSPACE_VESSEL } from 'router/routes'
import {
  selectIsAnyAreaReportLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
} from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './App.module.css'

const Map = lazy(() => import('features/map/Map'))
const Timebar = lazy(() => import('features/timebar/Timebar'))

const Main = () => {
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const locationType = useSelector(selectLocationType)
  const reportLocation = useSelector(selectIsAnyAreaReportLocation)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const isTimeComparisonReport = useSelector(selectShowTimeComparison)
  const isSmallScreen = useSmallScreen()

  const isRouteWithTimebar = locationType === VESSEL
  const isRouteWithMap = locationType !== 'SEARCH'
  const isWorkspacesRouteWithTimebar =
    isWorkspaceLocation ||
    locationType === WORKSPACE_VESSEL ||
    isPortReportLocation ||
    (isVesselGroupReportLocation && !isTimeComparisonReport) ||
    (reportLocation && !isTimeComparisonReport)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const showTimebar =
    isRouteWithTimebar ||
    (isWorkspacesRouteWithTimebar && workspaceStatus === AsyncReducerStatus.Finished)

  return (
    <Fragment>
      {isRouteWithMap && (
        <div
          className={cx(styles.mapContainer, {
            [styles.withTimebar]: showTimebar && isWorkspaceReady,
            [styles.withSmallScreenSwitch]: isSmallScreen,
            [styles.withTimebarAndSmallScreenSwitch]: showTimebar && isSmallScreen,
          })}
        >
          {isWorkspaceReady && <Map />}
        </div>
      )}
      {showTimebar && isWorkspaceReady && <Timebar />}
      <Footer />
    </Fragment>
  )
}

export default Main
