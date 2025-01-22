import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import dynamic from 'next/dynamic'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import Footer from 'features/footer/Footer'
import { selectShowTimeComparison } from 'features/reports/areas/area-reports.selectors'
import {
  selectIsWorkspaceMapReady,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { VESSEL, WORKSPACE_VESSEL } from 'routes/routes'
import {
  selectIsAnyAreaReportLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './App.module.css'

const Map = dynamic(() => import(/* webpackChunkName: "Map" */ 'features/map/Map'))
const Timebar = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar'))

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
  const isWorkspaceMapReady = useSelector(selectIsWorkspaceMapReady)
  const showTimebar =
    isRouteWithTimebar ||
    (isWorkspacesRouteWithTimebar && workspaceStatus === AsyncReducerStatus.Finished)

  return (
    <Fragment>
      {isRouteWithMap && (
        <div
          className={cx(styles.mapContainer, {
            [styles.withTimebar]: showTimebar && isWorkspaceMapReady,
            [styles.withSmallScreenSwitch]: isSmallScreen,
            [styles.withTimebarAndSmallScreenSwitch]: showTimebar && isSmallScreen,
          })}
        >
          {isWorkspaceMapReady && <Map />}
        </div>
      )}
      {showTimebar && isWorkspaceMapReady && <Timebar />}
      <Footer />
    </Fragment>
  )
}

export default Main
