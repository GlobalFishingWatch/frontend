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
import WorkspaceError from 'features/workspace/WorkspaceError'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectWorkspaceVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { selectHasReportVessels } from 'features/reports/reports.selectors'
import ReportVesselsPlaceholder from 'features/reports/ReportVesselsPlaceholder'
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

  if (
    workspaceStatus === AsyncReducerStatus.Error ||
    workspaceVesselGroupsStatus === AsyncReducerStatus.Error
  ) {
    return <WorkspaceError />
  }

  const handleTabClick = (option) => {
    dispatchQueryParams({ reportCategory: option.id, reportVesselPage: 0 })
  }

  // TODO get this from datasets config
  const activityUnit = reportCategory === DataviewCategory.Activity ? 'hour' : 'detection'

  const Header = (
    <Fragment>
      <ReportTitle title={areaDetail?.name} type="activity" />
      {filteredCategoryTabs.length > 1 && (
        <Tabs tabs={filteredCategoryTabs} activeTab={reportCategory} onTabClick={handleTabClick} />
      )}
    </Fragment>
  )
  const hasAuthError = reportStatus === AsyncReducerStatus.Error && isAuthError(statusError)
  const hasNoReportVessels = reportStatus === AsyncReducerStatus.Finished && !hasReportVessels
  if (hasNoReportVessels || hasAuthError) {
    return (
      <Fragment>
        {Header}
        <ReportActivity activityUnit={activityUnit} />
        {hasAuthError && <ReportVesselsPlaceholder />}
        {hasNoReportVessels && (
          <p>{t('analysis.noDataByArea', 'No data available for the selected area')}</p>
        )}
      </Fragment>
    )
  }

  if (reportStatus !== AsyncReducerStatus.Finished) {
    return (
      <Fragment>
        {Header}
        <ReportActivity activityUnit={activityUnit} />
        <Spinner />
      </Fragment>
    )
  }

  return (
    <Fragment>
      {Header}
      <ReportSummary activityUnit={activityUnit} />
      <ReportActivity activityUnit={activityUnit} />
      <ReportVessels activityUnit={activityUnit} reportName={areaDetail?.name} />
      <ReportDownload reportName={areaDetail?.name} />
    </Fragment>
  )
}
