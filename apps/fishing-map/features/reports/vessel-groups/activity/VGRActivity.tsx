import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { isActivityReport } from 'features/dataviews/selectors/dataviews.selectors'
import {
  useFitAreaInViewport,
  useReportAreaBounds,
} from 'features/reports/areas/area-reports.hooks'
import ReportSummary from 'features/reports/areas/summary/ReportSummary'
import ReportActivity from 'features/reports/shared/activity/ReportActivity'
import AreaReportSearch from 'features/reports/shared/area/AreaReportSearch'
import styles from 'features/reports/vessel-groups/activity/VGRActivity.module.css'
import VGRActivitySubsectionSelector from 'features/reports/vessel-groups/activity/VGRActivitySubsectionSelector.tsx'

function VGRActivity() {
  const reportCategory = useSelector(selectReportCategory)
  const activityUnit = isActivityReport(reportCategory) ? 'hour' : 'detection'

  // const fitAreaInViewport = useFitAreaInViewport()
  // const { loaded, bbox } = useReportAreaBounds()
  // console.log('🚀 ~ VGRActivity ~ loaded:', loaded)
  // const bboxHash = bbox ? bbox.join(',') : ''

  // // This ensures that the area is in viewport when then area load finishes
  // useEffect(() => {
  //   if (loaded && bbox?.length) {
  //     debugger
  //     fitAreaInViewport()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loaded, bboxHash])

  return (
    <Fragment>
      <div className={styles.container}>
        <VGRActivitySubsectionSelector />
        <ReportSummary activityUnit={activityUnit} />
        <AreaReportSearch />
      </div>
      <ReportActivity />
    </Fragment>
  )
}

export default VGRActivity
