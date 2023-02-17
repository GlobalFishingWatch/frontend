import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniqBy } from 'lodash'
import { Spinner, Tabs } from '@globalfishingwatch/ui-components'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useLocationConnect } from 'routes/routes.hook'
import { selectReportCategory } from 'features/app/app.selectors'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { useFetchReportArea, useFetchReportVessel } from './reports.hooks'
import ReportSummary from './ReportSummary'
import ReportTitle from './ReportTitle'
import ReportActivity from './ReportActivity'
import ReportVessels from './ReportVessels'
import ReportDownload from './ReportDownload'

export type ReportType = 'activity' | 'area'
export type ReportActivityUnit = 'hours' | 'detections'

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
  const { status: reportStatus } = useFetchReportVessel()
  const { data: areaDetail } = useFetchReportArea()

  if (reportStatus === AsyncReducerStatus.Error) return <p>There was a error</p>
  if (reportStatus !== AsyncReducerStatus.Finished) return <Spinner />

  const handleTabClick = (option) => {
    dispatchQueryParams({ reportCategory: option.id, reportVesselPage: 0 })
  }

  // TODO get this from datasets config
  const activityUnit = 'hours' // using hours as we are doing only fishing effort for now

  return (
    <Fragment>
      <ReportTitle title={areaDetail?.name} type="activity" />
      {filteredCategoryTabs.length > 1 && (
        <Tabs tabs={filteredCategoryTabs} activeTab={reportCategory} onTabClick={handleTabClick} />
      )}
      <ReportSummary />
      <ReportActivity activityUnit={activityUnit} />
      <ReportVessels activityUnit={activityUnit} reportName={areaDetail?.name} />
      <ReportDownload reportName={areaDetail?.name} />
    </Fragment>
  )
}
