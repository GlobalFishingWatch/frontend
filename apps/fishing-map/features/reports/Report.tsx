import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniqBy } from 'lodash'
import { Tab, Tabs } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { isAuthError } from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useLocationConnect } from 'routes/routes.hook'
import { selectReportCategory } from 'features/app/app.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import WorkspaceError from 'features/workspace/WorkspaceError'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { selectHasReportVessels } from 'features/reports/reports.selectors'
import ReportVesselsPlaceholder from 'features/reports/ReportVesselsPlaceholder'
import { isGuestUser } from 'features/user/user.slice'
import { ReportCategory } from 'types'
import { useFetchReportArea, useFetchReportVessel } from './reports.hooks'
import ReportSummary from './ReportSummary'
import ReportTitle from './ReportTitle'
import ReportActivity from './ReportActivity'
import ReportVessels from './ReportVessels'
import ReportDownload from './ReportDownload'
import styles from './Report.module.css'

export type ReportActivityUnit = 'hour' | 'detection'

export default function Report() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const guestUser = useSelector(isGuestUser)
  const dataviewCategories = uniqBy(useSelector(selectActiveHeatmapDataviews), 'category').map(
    (d) => d.category
  )
  const categoryTabs: Tab[] = [
    {
      id: DataviewCategory.Activity,
      title: t('common.activity', 'Activity'),
      content: '',
    },
    {
      id: DataviewCategory.Detections,
      title: t('common.detections', 'Detections'),
      content: '',
    },
  ]
  const filteredCategoryTabs = categoryTabs.filter((tab) =>
    dataviewCategories.includes(tab.id as DataviewCategory)
  )

  const { status: reportStatus, error: statusError } = useFetchReportVessel()
  const { data: areaDetail } = useFetchReportArea()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const hasVessels = useSelector(selectHasReportVessels)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  const handleTabClick = (option: Tab) => {
    dispatchQueryParams({ reportCategory: option.id as ReportCategory, reportVesselPage: 0 })
  }

  // TODO get this from datasets config
  const activityUnit = reportCategory === DataviewCategory.Activity ? 'hour' : 'detection'

  const hasAuthError = reportStatus === AsyncReducerStatus.Error && isAuthError(statusError)
  const reportLoaded = reportStatus === AsyncReducerStatus.Finished

  return (
    <Fragment>
      <ReportTitle area={areaDetail} />
      {filteredCategoryTabs.length > 1 && (
        <Tabs tabs={filteredCategoryTabs} activeTab={reportCategory} onTabClick={handleTabClick} />
      )}
      {reportLoaded && <ReportSummary activityUnit={activityUnit} />}
      <ReportActivity />
      {reportLoaded ? (
        hasVessels ? (
          <ReportVessels activityUnit={activityUnit} reportName={areaDetail?.name} />
        ) : (
          <p className={styles.noData}>
            {t('analysis.noDataByArea', 'No data available for the selected area')}
          </p>
        )
      ) : (
        <ReportVesselsPlaceholder />
      )}
      {hasAuthError && (
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
      )}
      <ReportDownload reportName={areaDetail?.name} />
    </Fragment>
  )
}
