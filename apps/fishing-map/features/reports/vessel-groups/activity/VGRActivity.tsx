import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { isActivityReport } from 'features/dataviews/selectors/dataviews.selectors'
import ReportSummary from 'features/reports/areas/summary/ReportSummary'
import ReportActivity from 'features/reports/shared/activity/ReportActivity'
import AreaReportSearch from 'features/reports/shared/area/AreaReportSearch'
import VGRActivitySubsectionSelector from 'features/reports/vessel-groups/activity/VGRActivitySubsectionSelector.tsx'

import styles from 'features/reports/vessel-groups/activity/VGRActivity.module.css'

function VGRActivity() {
  const reportCategory = useSelector(selectReportCategory)
  const activityUnit = isActivityReport(reportCategory) ? 'hour' : 'detection'

  return (
    <Fragment>
      <div className={styles.container}>
        <VGRActivitySubsectionSelector />
        {/* TODO:CVP uncomment this */}
        {/* <ReportSummary activityUnit={activityUnit} showTags={false} />
        <AreaReportSearch /> */}
      </div>
      <ReportActivity />
    </Fragment>
  )
}

export default VGRActivity
