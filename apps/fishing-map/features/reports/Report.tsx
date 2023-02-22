import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniqBy } from 'lodash'
import { Spinner, Tabs } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { isAuthError } from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useLocationConnect } from 'routes/routes.hook'
import { selectReportCategory } from 'features/app/app.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import WorkspaceError, { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { selectHasReportVessels } from 'features/reports/reports.selectors'
import { useFetchReportArea, useFetchReportVessel } from './reports.hooks'
import ReportSummary from './ReportSummary'
import ReportTitle from './ReportTitle'
import ReportActivity from './ReportActivity'
import ReportVessels from './ReportVessels'
import ReportDownload from './ReportDownload'

export type ReportType = 'activity' | 'area'
export type ReportActivityUnit = 'hour' | 'detection'

export default function Report() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const dataviewCategories = uniqBy(useSelector(selectActiveHeatmapDataviews), 'category').map(
    (d) => d.category
  )
  const categoryTabs = [
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
  const filteredCategoryTabs = categoryTabs.filter((tab) => dataviewCategories.includes(tab.id))
  const { status: reportStatus, error: statusError } = useFetchReportVessel()
  const { data: areaDetail } = useFetchReportArea()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const hasReportVessels = useSelector(selectHasReportVessels)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  if (reportStatus === AsyncReducerStatus.Error) {
    if (isAuthError(statusError)) {
      return (
        <WorkspaceLoginError
          title={t('errors.privateReport', 'This is a private report')}
          emailSubject={`Requesting access for ${datasetId}-${areaId} report`}
        />
      )
    }
    return <p>There was a unkown error</p>
  }
  if (reportStatus !== AsyncReducerStatus.Finished) return <Spinner />

  const handleTabClick = (option) => {
    dispatchQueryParams({ reportCategory: option.id, reportVesselPage: 0 })
  }

  // TODO get this from datasets config
  const activityUnit = reportCategory === DataviewCategory.Activity ? 'hour' : 'detection'

  return (
    <Fragment>
      <ReportTitle title={areaDetail?.name} type="activity" />
      {filteredCategoryTabs.length > 1 && (
        <Tabs tabs={filteredCategoryTabs} activeTab={reportCategory} onTabClick={handleTabClick} />
      )}
      {hasReportVessels ? (
        <Fragment>
          <ReportSummary activityUnit={activityUnit} />
          <ReportActivity activityUnit={activityUnit} />

          <ReportVessels activityUnit={activityUnit} reportName={areaDetail?.name} />
          <ReportDownload reportName={areaDetail?.name} />
        </Fragment>
      ) : (
        // TODO add styles
        <p>{t('analysis.noDataByArea', 'No data available for the selected area')}</p>
      )}
    </Fragment>
  )
}
