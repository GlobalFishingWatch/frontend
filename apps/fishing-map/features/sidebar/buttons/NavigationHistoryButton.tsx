import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Link from 'redux-first-router-link'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { resetAreaDetail } from 'features/areas/areas.slice'
import { selectHasVesselProfileInstancePinned } from 'features/dataviews/selectors/dataviews.selectors'
import { useHighlightReportArea } from 'features/reports/report-area/area-reports.hooks'
import { selectReportAreaIds } from 'features/reports/report-area/area-reports.selectors'
import { resetVesselGroupReportData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { EMPTY_FILTERS } from 'features/search/search.config'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { usePinVesselProfileToWorkspace } from 'features/sidebar/sidebar-header.hooks'
import { setVesselEventId } from 'features/vessel/vessel.slice'
import {
  selectFeatureFlags,
  selectWorkspaceHistoryNavigation,
} from 'features/workspace/workspace.selectors'
import {
  cleanCurrentWorkspaceReportState,
  cleanReportQuery,
  setWorkspaceHistoryNavigation,
} from 'features/workspace/workspace.slice'
import { REPORT, VESSEL, WORKSPACE_REPORT, WORKSPACE_VESSEL, WORKSPACES_LIST } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectIsAnyReportLocation,
  selectIsAnyVesselLocation,
  selectIsRouteWithWorkspace,
  selectIsWorkspaceVesselLocation,
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
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const hasVesselProfileInstancePinned = useSelector(selectHasVesselProfileInstancePinned)
  const onPinVesselToWorkspaceAndNavigateClick = usePinVesselProfileToWorkspace()
  const { dispatchQueryParams } = useLocationConnect()
  const highlightArea = useHighlightReportArea()
  const featureFlags = useSelector(selectFeatureFlags)
  const reportAreaIds = useSelector(selectReportAreaIds)
  const lastWorkspaceVisited = workspaceHistoryNavigation[workspaceHistoryNavigation.length - 1]

  const trackAnalytics = useCallback(() => {
    const analyticsAction = isAnyVesselLocation
      ? 'close_vessel_panel'
      : isAnyReportLocation
        ? 'close_report_panel'
        : isRouteWithWorkspace
          ? 'close_workspace'
          : ''

    if (analyticsAction) {
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: analyticsAction,
      })
    }
  }, [isAnyVesselLocation, isAnyReportLocation, isRouteWithWorkspace])

  const onCloseClick = useCallback(() => {
    resetSidebarScroll()

    // Reset search state
    dispatchQueryParams({ ...EMPTY_FILTERS, userTab: undefined })
    dispatch(cleanVesselSearchResults())

    // Reset report state
    highlightArea(undefined)
    dispatch(resetReportData())
    dispatch(resetVesselGroupReportData())
    dispatch(resetAreaDetail(reportAreaIds))
    dispatch(cleanCurrentWorkspaceReportState())
    dispatch(setVesselEventId(null))

    // Pop the last workspace visited from the history navigation
    const historyNavigation = workspaceHistoryNavigation.slice(0, -1)
    dispatch(setWorkspaceHistoryNavigation(historyNavigation))
    trackAnalytics()
  }, [
    dispatch,
    dispatchQueryParams,
    highlightArea,
    reportAreaIds,
    trackAnalytics,
    workspaceHistoryNavigation,
  ])

  if (workspaceHistoryNavigation.length) {
    const previousLocation =
      lastWorkspaceVisited.type === VESSEL || lastWorkspaceVisited.type === WORKSPACE_VESSEL
        ? t('vessel.title', 'Vessel profile')
        : lastWorkspaceVisited.type === REPORT || lastWorkspaceVisited.type === WORKSPACE_REPORT
          ? t('analysis.title', 'Report')
          : lastWorkspaceVisited.type === WORKSPACES_LIST
            ? t('workspace.list', 'Workspaces list')
            : t('workspace.title', 'Workspace')

    const tooltip = t('navigateBackTo', 'Go back to {{section}}', {
      section: previousLocation.toLocaleLowerCase(),
    })

    const linkTo = {
      ...lastWorkspaceVisited,
      payload: {
        ...(lastWorkspaceVisited.type !== 'REPORT'
          ? cleanReportPayload(lastWorkspaceVisited.payload)
          : lastWorkspaceVisited.payload),
      },
      query: {
        ...(lastWorkspaceVisited.type !== 'REPORT'
          ? { ...cleanReportQuery(lastWorkspaceVisited.query), ...EMPTY_FILTERS }
          : lastWorkspaceVisited.query),
        featureFlags,
      },
      isHistoryNavigation: true,
    }

    if (isWorkspaceVesselLocation && !hasVesselProfileInstancePinned) {
      // Can't use Link because we need to intercept the navigation to show the confirmation dialog
      return (
        <IconButton
          icon="close"
          type="border"
          onClick={() => onPinVesselToWorkspaceAndNavigateClick(linkTo)}
          className={cx(styles.workspaceLink, 'print-hidden')}
          tooltip={tooltip}
        />
      )
    }

    return (
      <Link className={styles.workspaceLink} to={linkTo} onClick={onCloseClick}>
        <IconButton className="print-hidden" type="border" icon="close" tooltip={tooltip} />
      </Link>
    )
  }
}

export default NavigationHistoryButton
