import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Link from 'redux-first-router-link'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { resetAreaDetail } from 'features/areas/areas.slice'
import { selectReportAreaIds } from 'features/reports/report-area/area-reports.selectors'
import { resetVesselGroupReportData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { EMPTY_SEARCH_FILTERS } from 'features/search/search.config'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { cleanVesselProfileDataviewInstances } from 'features/sidebar/sidebar-header.hooks'
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

  const onCloseClick = useCallback(() => {
    resetSidebarScroll()

    dispatch(cleanVesselSearchResults())

    dispatch(resetReportData())
    dispatch(resetVesselGroupReportData())
    dispatch(resetAreaDetail(reportAreaIds))
    dispatch(cleanCurrentWorkspaceReportState())
    dispatch(setVesselEventId(null))

    trackAnalytics()
  }, [dispatch, reportAreaIds, trackAnalytics])

  const isPreviousLocationReport = REPORT_ROUTES.includes(lastWorkspaceVisited.type)

  if (workspaceHistoryNavigation.length) {
    const previousLocation =
      lastWorkspaceVisited.type === VESSEL || lastWorkspaceVisited.type === WORKSPACE_VESSEL
        ? t('vessel.title', 'Vessel profile')
        : isPreviousLocationReport
          ? t('analysis.title', 'Report')
          : isVesselGroupReportLocation
            ? t('vesselGroup.vesselGroupProfile', 'Vessel group profile')
            : lastWorkspaceVisited.type === WORKSPACES_LIST
              ? t('workspace.list', 'Workspaces list')
              : t('workspace.title', 'Workspace')

    const tooltip = t('navigateBackTo', 'Go back to {{section}}', {
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
