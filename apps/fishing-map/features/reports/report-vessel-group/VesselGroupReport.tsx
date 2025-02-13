import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Tab } from '@globalfishingwatch/ui-components'
import { Button, Tabs } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGRFootprintDataview } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import {
  useFitAreaInViewport,
  useReportAreaCenter,
  useVesselGroupBounds,
} from 'features/reports/report-area/area-reports.hooks'
import { selectReportCategory } from 'features/reports/reports.selectors'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import EventsReport from 'features/reports/tabs/events/EventsReport'
import VesselGroupReportInsights from 'features/reports/tabs/vessel-group-insights/VGRInsights'
import {
  useTimebarVesselGroupConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { isOutdatedVesselGroup } from 'features/vessel-groups/vessel-groups.utils'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { TimebarVisualisations } from 'types'
import { getEventLabel } from 'utils/analytics'
import { AsyncReducerStatus } from 'utils/async-slice'

import { ReportCategory } from '../reports.types'
import { selectReportVesselsTimeRange } from '../shared/vessels/report-vessels.selectors'
import ReportActivity from '../tabs/activity/ReportActivity'

import { useEditVesselGroupModal, useFetchVesselGroupReport } from './vessel-group-report.hooks'
import { selectVGRData, selectVGRStatus } from './vessel-group-report.slice'
import VesselGroupReportError from './VesselGroupReportError'
import VesselGroupReportTitle from './VesselGroupReportTitle'

import styles from './VesselGroupReport.module.css'

function VesselGroupReport() {
  useMigrateWorkspaceToast()
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const fetchVesselGroupReport = useFetchVesselGroupReport()
  const vesselGroupId = useSelector(selectReportVesselGroupId)
  const vesselGroup = useSelector(selectVGRData)!
  const reportStatus = useSelector(selectVGRStatus)
  const reportCategory = useSelector(selectReportCategory)
  const reportDataview = useSelector(selectVGRFootprintDataview)
  const timeRange = useSelector(selectReportVesselsTimeRange)
  const userData = useSelector(selectUserData)
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedVGId } = useTimebarVesselGroupConnect()
  const fitAreaInViewport = useFitAreaInViewport()
  const { bbox } = useVesselGroupBounds(reportDataview?.id)
  const coordinates = useReportAreaCenter(bbox!)
  const setMapCoordinates = useSetMapCoordinates()
  const bboxHash = bbox ? bbox.join(',') : ''
  const isOutdated = isOutdatedVesselGroup(vesselGroup)
  const onEditClick = useEditVesselGroupModal()

  useEffect(() => {
    fetchVesselGroupReport(vesselGroupId)
    if (reportDataview) {
      dispatchTimebarVisualisation(TimebarVisualisations.VesselGroup)
      dispatchTimebarSelectedVGId(reportDataview?.id)
    }
  }, [
    reportDataview,
    dispatchTimebarSelectedVGId,
    dispatchTimebarVisualisation,
    fetchVesselGroupReport,
    vesselGroupId,
  ])

  useEffect(() => {
    if (reportCategory === ReportCategory.VesselGroup && coordinates) {
      setMapCoordinates(coordinates)
    }
  }, [bboxHash, setMapCoordinates])

  useEffect(() => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'update_time_range_from_vessel_group_report',
      label: getEventLabel([timeRange?.start || '', timeRange?.end || '']),
    })
  }, [timeRange])

  const changeTab = useCallback(
    (tab: Tab<ReportCategory>) => {
      dispatchQueryParams({ reportCategory: tab.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `access_vessel_group_${tab.id}_tab`,
        label: getEventLabel([vesselGroup?.id, timeRange?.start || '', timeRange?.end || '']),
        value: `number of vessels: ${vesselGroup?.vessels?.length}`,
      })
      if (tab.id === 'activity') {
        fitAreaInViewport()
      }
    },
    [dispatchQueryParams, fitAreaInViewport, timeRange, vesselGroup]
  )

  const loading = reportStatus === AsyncReducerStatus.Loading

  const sectionTabs: Tab<ReportCategory>[] = useMemo(
    () => [
      {
        id: ReportCategory.VesselGroup,
        title: t('common.vessels', 'vessels'),
        content: <ReportVessels loading={loading} color={reportDataview?.config?.color} />,
      },
      {
        id: ReportCategory.VesselGroupInsights,
        title: t('common.insights', 'Insights'),
        content: <VesselGroupReportInsights />,
      },
      {
        id: ReportCategory.Activity,
        title: t('common.activity', 'Activity'),
        content: <ReportActivity />,
      },
      {
        id: ReportCategory.Events,
        title: t('common.events', 'Events'),
        content: <EventsReport />,
      },
    ],
    [t, reportDataview?.config?.color, loading]
  )

  const isOwnedByUser = vesselGroup?.ownerId === userData?.id
  if (isOutdated) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.updateContainer}>
          <label>
            {t(
              'vesselGroupReport.linkDisabled',
              'This vessel group needs to be updated to latest available data'
            )}
          </label>
          {isOwnedByUser && (
            <Button onClick={() => onEditClick(vesselGroup)}>
              {t('vesselGroup.clickToUpdate', 'Click to update')}
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (reportStatus === AsyncReducerStatus.Error) {
    return <VesselGroupReportError vesselGroupId={vesselGroupId} />
  }

  return (
    <div>
      <VesselGroupReportTitle vesselGroup={vesselGroup} loading={loading} />
      <Tabs
        tabs={sectionTabs}
        activeTab={reportCategory}
        onTabClick={changeTab}
        // mountAllTabsOnLoad
      />
    </div>
  )
}

export default VesselGroupReport
