import { Fragment, lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import Footer from 'features/map/footer/Footer'
import { selectScreenshotMode } from 'features/map/workspace/selectors/app.selectors'
import {
  selectIsWorkspaceReady,
  selectWorkspaceStatus,
} from 'features/map/workspace/workspace.selectors'
import { selectShowTimeComparison } from 'features/reports/report-area/area-reports.selectors'
import { VESSEL, WORKSPACE_VESSEL } from 'router/routes'
import {
  selectIsAnyAreaReportLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
} from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

// Shared with the layouts: the @media print rules cross-reference .splitContainer/.aside and
// .mapContainer/.withTimebar, so these classes must stay in one CSS module.
import styles from 'features/layouts/layouts.module.css'

const Map = lazy(() => import('features/map/map/Map'))
const Timebar = lazy(() => import('features/map/timebar/Timebar'))

const Main = () => {
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const screenshotMode = useSelector(selectScreenshotMode)
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
          {isWorkspaceReady && (
            <Suspense fallback={null}>
              <Map />
            </Suspense>
          )}
        </div>
      )}
      {showTimebar && isWorkspaceReady && (
        <Suspense fallback={null}>
          <Timebar />
        </Suspense>
      )}
      {!screenshotMode && <Footer />}
    </Fragment>
  )
}

export default Main
