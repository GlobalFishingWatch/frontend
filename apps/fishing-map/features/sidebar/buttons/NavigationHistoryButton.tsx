import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Link from 'redux-first-router-link'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { resetAreaDetail } from 'features/areas/areas.slice'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { selectReportAreaIds } from 'features/reports/report-area/area-reports.selectors'
import { resetVesselGroupReportData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { EMPTY_SEARCH_FILTERS } from 'features/search/search.config'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { cleanVesselProfileDataviewInstances } from 'features/sidebar/sidebar-header.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useSetTrackCorrectionId } from 'features/track-correction/track-correction.hooks'
import {
  resetTrackCorrection,
  setTrackCorrectionTimerange,
} from 'features/track-correction/track-correction.slice'
import { setVesselEventId } from 'features/vessel/vessel.slice'
import { selectWorkspaceHistoryNavigation } from 'features/workspace/workspace.selectors'
import {
  cleanCurrentWorkspaceReportState,
  cleanReportQuery,
} from 'features/workspace/workspace.slice'
import { REPORT_ROUTES, VESSEL, WORKSPACE_VESSEL, WORKSPACES_LIST } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectIsAnyReportLocation,
  selectIsAnyVesselLocation,
  selectIsRouteWithWorkspace,
  selectIsVesselGroupReportLocation,
} from 'routes/routes.selectors'

import styles from '../SidebarHeader.module.css'

function cleanReportPayload(payload: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { areaId, datasetId, reportId, ...rest } = payload || {}
  return rest
}

function NavigationHistoryButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceHistoryNavigation = useSelector(selectWorkspaceHistoryNavigation)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isRouteWithWorkspace = useSelector(selectIsRouteWithWorkspace)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const { dispatchQueryParams } = useLocationConnect()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const lastWorkspaceVisited = workspaceHistoryNavigation[workspaceHistoryNavigation.length - 1]
  const setTrackCorrectionId = useSetTrackCorrectionId()
  const { setTimerange } = useTimerangeConnect()
  const setMapCoordinates = useSetMapCoordinates()

  const trackAnalytics = useCallback(() => {
    const analyticsAction = isAnyVesselLocation
      ? 'close_vessel_panel'
      : isAnyReportLocation
        ? 'close_report_panel'
        : isVesselGroupReportLocation
          ? 'close_vessel_group_report_panel'
          : isRouteWithWorkspace
            ? 'close_workspace'
            : ''

    if (analyticsAction) {
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: analyticsAction,
      })
    }
  }, [isAnyVesselLocation, isAnyReportLocation, isVesselGroupReportLocation, isRouteWithWorkspace])

  const resetQueryParams = useCallback(() => {
    dispatchQueryParams({ ...EMPTY_SEARCH_FILTERS, userTab: undefined })
  }, [dispatchQueryParams])

  const { start, end, latitude, longitude, zoom } = lastWorkspaceVisited.query
  const onCloseClick = useCallback(() => {
    resetSidebarScroll()

    dispatch(cleanVesselSearchResults())

    dispatch(resetReportData())
    dispatch(resetVesselGroupReportData())
    dispatch(resetAreaDetail(reportAreaIds))
    dispatch(cleanCurrentWorkspaceReportState())
    dispatch(setVesselEventId(null))

    setTrackCorrectionId('')
    dispatch(resetTrackCorrection())
    dispatch(
      setTrackCorrectionTimerange({
        start: '',
        end: '',
      })
    )

    if (start && end) {
      setTimerange({
        start,
        end,
      })
    }

    setMapCoordinates({
      latitude,
      longitude,
      zoom,
    })

    trackAnalytics()
  }, [
    dispatch,
    end,
    latitude,
    longitude,
    start,
    zoom,
    reportAreaIds,
    setMapCoordinates,
    setTimerange,
    setTrackCorrectionId,
    trackAnalytics,
  ])

  const isPreviousLocationReport = REPORT_ROUTES.includes(lastWorkspaceVisited.type)

  if (workspaceHistoryNavigation.length) {
    const previousLocation =
      lastWorkspaceVisited.type === VESSEL || lastWorkspaceVisited.type === WORKSPACE_VESSEL
        ? t((t) => t.vessel.title)
        : isPreviousLocationReport
          ? t((t) => t.analysis.title)
          : isVesselGroupReportLocation
            ? t((t) => t.vesselGroup.vesselGroupProfile)
            : lastWorkspaceVisited.type === WORKSPACES_LIST
              ? t((t) => t.workspace.list)
              : t((t) => t.workspace.title)

    const tooltip = t((t) => t.common.navigateBackTo, {
      section: previousLocation.toLocaleLowerCase(),
    })

    const query = {
      ...(!isPreviousLocationReport
        ? { ...cleanReportQuery(lastWorkspaceVisited.query || {}), ...EMPTY_SEARCH_FILTERS }
        : lastWorkspaceVisited.query),
    }
    const linkTo = {
      ...lastWorkspaceVisited,
      payload: {
        ...(!isPreviousLocationReport
          ? cleanReportPayload(lastWorkspaceVisited.payload)
          : lastWorkspaceVisited.payload),
      },
      query: {
        ...query,
        dataviewInstances: cleanVesselProfileDataviewInstances(query.dataviewInstances),
      },
      isHistoryNavigation: true,
    }

    return (
      <Link
        className={cx(styles.workspaceLink, 'print-hidden')}
        to={linkTo}
        onClick={() => {
          resetQueryParams()
          onCloseClick()
        }}
      >
        <IconButton type="border" icon="close" tooltip={tooltip} />
      </Link>
    )
  }
}

export default NavigationHistoryButton
