import { Fragment, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'lodash'
import { Tab, Tabs } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { isAuthError } from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useLocationConnect } from 'routes/routes.hook'
import { selectReportCategory, selectTimeRange } from 'features/app/app.selectors'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import WorkspaceError from 'features/workspace/WorkspaceError'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { selectHasReportVessels } from 'features/reports/reports.selectors'
import ReportVesselsPlaceholder from 'features/reports/placeholders/ReportVesselsPlaceholder'
import { isGuestUser } from 'features/user/user.slice'
import { ReportCategory, TimebarVisualisations } from 'types'
import { getDownloadReportSupported } from 'features/download/download.utils'
import { SUPPORT_EMAIL } from 'data/config'
import {
  useTimebarEnvironmentConnect,
  useTimebarVisualisationConnect,
} from 'features/timebar/timebar.hooks'
import { useFetchReportArea, useFetchReportVessel } from './reports.hooks'
import ReportSummary from './summary/ReportSummary'
import ReportTitle from './title/ReportTitle'
import ReportActivity from './activity/ReportActivity'
import ReportVessels from './vessels/ReportVessels'
import ReportDownload from './download/ReportDownload'
import ReportEnvironment from './environment/ReportEnvironment'
import styles from './Report.module.css'

export type ReportActivityUnit = 'hour' | 'detection'

function ActivityReport({ reportName }: { reportName: string }) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const timerange = useSelector(selectTimeRange)
  const guestUser = useSelector(isGuestUser)
  const timerangeTooLong = !getDownloadReportSupported(timerange.start, timerange.end)
  const { status: reportStatus, error: statusError } = useFetchReportVessel()
  const hasVessels = useSelector(selectHasReportVessels)

  // TODO get this from datasets config
  const activityUnit =
    reportCategory === ReportCategory.Fishing || reportCategory === ReportCategory.Presence
      ? 'hour'
      : 'detection'

  const reportLoading = reportStatus === AsyncReducerStatus.Loading
  const reportError = reportStatus === AsyncReducerStatus.Error
  const reportLoaded = reportStatus === AsyncReducerStatus.Finished
  const hasAuthError = reportError && isAuthError(statusError)
  return (
    <Fragment>
      <ReportSummary activityUnit={activityUnit} reportStatus={reportStatus} />
      <ReportActivity />
      {reportLoading && <ReportVesselsPlaceholder />}
      {reportLoaded ? (
        hasVessels ? (
          <Fragment>
            <ReportVessels activityUnit={activityUnit} reportName={reportName} />
            <ReportDownload />
          </Fragment>
        ) : (
          <p className={styles.error}>
            {t('analysis.noDataByArea', 'No data available for the selected area')}
          </p>
        )
      ) : null}
      {reportError ? (
        hasAuthError ? (
          <ReportVesselsPlaceholder
            title={
              guestUser
                ? t('errors.reportLogin', 'Login to see the vessels active in the area')
                : t(
                    'errors.privateReport',
                    "Your account doesn't have permissions to see the vessels active in this area"
                  )
            }
          />
        ) : (
          <p className={styles.error}>
            <span>
              {t('errors.generic', 'Something went wrong, try again or contact:')}{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </span>
          </p>
        )
      ) : null}
      {timerangeTooLong && (
        <p className={styles.error}>
          {t(
            'analysis.timeRangeTooLong',
            'Reports are only allowed for time ranges up to one year'
          )}
        </p>
      )}
    </Fragment>
  )
}

export default function Report() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const dataviews = useSelector(selectActiveTemporalgridDataviews)
  const dataviewCategories = uniq(
    dataviews.map((d) =>
      d.category === DataviewCategory.Activity
        ? (d.datasets?.[0].subcategory as unknown as ReportCategory)
        : (d.category as unknown as ReportCategory)
    )
  )
  const categoryTabs: Tab<ReportCategory>[] = [
    {
      id: ReportCategory.Fishing,
      title: t('common.fishing', 'Fishing'),
    },
    {
      id: ReportCategory.Presence,
      title: t('common.presence', 'Presence'),
    },
    {
      id: ReportCategory.Detections,
      title: t('common.detections', 'Detections'),
    },
    {
      id: ReportCategory.Environment,
      title: t('common.environment', 'Environment'),
    },
  ]
  const filteredCategoryTabs = categoryTabs.filter((tab) => dataviewCategories.includes(tab.id))
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { data: areaDetail } = useFetchReportArea()
  const { dispatchTimebarVisualisation } = useTimebarVisualisationConnect()
  const { dispatchTimebarSelectedEnvId } = useTimebarEnvironmentConnect()
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)

  const setTimebarVisualizationByCategory = useCallback(
    (category: ReportCategory) => {
      if (category === ReportCategory.Environment && dataviews?.length > 0) {
        dispatchTimebarVisualisation(TimebarVisualisations.Environment)
        dispatchTimebarSelectedEnvId(dataviews[0]?.id)
      } else {
        dispatchTimebarVisualisation(
          category === ReportCategory.Detections
            ? TimebarVisualisations.HeatmapDetections
            : TimebarVisualisations.HeatmapActivity
        )
      }
    },
    [dataviews, dispatchTimebarSelectedEnvId, dispatchTimebarVisualisation]
  )

  useEffect(() => {
    setTimebarVisualizationByCategory(reportCategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportCategory])

  const handleTabClick = (option: Tab<ReportCategory>) => {
    dispatchQueryParams({ reportCategory: option.id, reportVesselPage: 0 })
  }

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  return (
    <Fragment>
      <ReportTitle area={areaDetail} />
      {filteredCategoryTabs.length > 1 && (
        <Tabs tabs={filteredCategoryTabs} activeTab={reportCategory} onTabClick={handleTabClick} />
      )}
      {reportCategory === ReportCategory.Environment ? (
        <ReportEnvironment />
      ) : (
        <ActivityReport reportName={areaDetail?.name} />
      )}
    </Fragment>
  )
}
